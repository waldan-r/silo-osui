import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';
import { compileFunction } from 'vm';

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.AUTH_GOOGLE_SECRET?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const DRIVE = google.drive({ 
    version: 'v3',
    auth
});

// filename convention: [ScoreCode] Title-Composer-Instrument.pdf
// e.g. [N0001] the_Nutcracker-Tchaikovsky-Clarinet1,2(Bb)_BassClarinet.pdf
const FILENAME_REGEX = /^\[([A-Z0-9]+)\]\s*(.+?)\s*[–-]\s*(.+?)\s*[–-]\s*(.+?)\.pdf$/i;

export async function syncDriveFiles(organizationId: string){
    const ORGANIZATION = await prisma.organization.findUnique({
        where: {id: organizationId},
        select: {driveFolderId: true}
    });

    if (!ORGANIZATION?.driveFolderId) throw new Error("Organization Drive Folder ID not found");
    console.log(`Syncing Organization: ${organizationId} | Folder: ${ORGANIZATION.driveFolderId}`);

    const RESULT = await DRIVE.files.list({
        q: `'${ORGANIZATION.driveFolderId}' in parents and mimeType = 'application/pdf' and trashed = false`,
        fields: 'files(id, name, webViewLink, webContentLink)',
        pageSize: 1000,
    });

    const FILES = RESULT.data.files || [];

    if (FILES.length === 0){
        console.log('No files found');
        return;
    }

    for (const FILE of FILES){
        if (!FILE.name) continue;
        
        const MATCH = FILE.name.match(FILENAME_REGEX);
        
        if (!MATCH){
            console.warn(`Skipped (Invalid Name): ${FILE.name}`);
        } else {
            const [_, CODE, TITLE, COMPOSER, INSTRUMENT] = MATCH;

            try{
                const SCORE = await prisma.score.upsert({
                    where:{
                        organizationId_code: {
                            organizationId,
                            code: CODE.trim()
                        }
                    },
                    update:{
                        title: TITLE.trim(),
                        composer: COMPOSER.trim(),
                    },
                    create: {
                        organizationId,
                        code: CODE.trim(),
                        title: TITLE.trim(),
                        composer: COMPOSER.trim(),
                    }
                });

                const EXISTING_PART = await prisma.part.findFirst({
                    where:{
                        driveId: FILE.id!
                    }
                });

                if (EXISTING_PART){
                    await prisma.part.update({
                        where:{
                            id: EXISTING_PART.id
                        },
                        data:{
                            filename: FILE.name,
                            webViewLink: FILE.webViewLink!,
                            webContentLink: FILE.webContentLink!,
                            instrumentTags: [INSTRUMENT.trim()]
                        }
                    });
                } else {
                    await prisma.part.create({
                        data:{
                            scoreId: SCORE.id,
                            driveId: FILE.id!,
                            filename: FILE.name,
                            webViewLink: FILE.webViewLink!,
                            webContentLink: FILE.webContentLink!,
                            instrumentTags: [INSTRUMENT.trim()]
                        }
                    });
                }
                console.log(`Synced: ${TITLE} - ${INSTRUMENT}`);
            } catch (error) {
                console.error(`Failed to sync flie ${FILE.name}:`, error);
            }
        }
    }


}