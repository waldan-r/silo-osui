import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { prisma } from "./prisma";
import { metadata } from "@/app/layout";

const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.AUTH_GOOGLE_SECRET?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function syncMetadataFromSheet(organizationId: string, sheetId: string){
    const DOC = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    
    await DOC.loadInfo();
    const SHEET = DOC.sheetsByIndex[0];
    const ROWS = await SHEET.getRows();

    console.log(`Found ${ROWS.length} rows in catalog`);

    for (const ROW of ROWS){
        const CODE = ROW.get('Kode');

        if (!CODE) continue;

        const METADATA = {
            genre: ROW.get('Genre'),
            duration: ROW.get('Durasi'),
            performanceFormat: ROW.get('Format'),
            yearAdded: ROW.get('TahunPengadaan'),
            lastUpdatetSheet: new Date().toISOString(),            
        };

        try {
            await prisma.score.update({
                where:{
                    organizationId_code:{
                        organizationId: organizationId,
                        code: CODE
                    }  
                },
                data:{
                    metadata: METADATA
                }
            });
            console.log(`Metadata synced for: ${CODE}`);
        } catch (e) {
            console.warn(`Skipped ${CODE}: Score not found in DB yet`);
        }
    }
}