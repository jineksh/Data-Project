import fs from 'fs'
import path from 'path'
import { prisma } from '../config/databse.js'
import Papa from 'papaparse';

const rootDir = path.resolve(process.cwd(),'../data');


export async function scanDataSetService() {


    console.log('inside scanDataSetService');

    const cheak = fs.existsSync(rootDir);

    console.log(rootDir);

    console.log(cheak);

    if (cheak) {

        const dataFiles = fs.readdirSync(rootDir);

        for (const file of dataFiles) {

            console.log('inside for Lopp');

            

            const fullPath = path.join(rootDir, file);

            console.log(fullPath)

            

            const stats = fs.statSync(fullPath);

            if (stats.isFile()) {
                const parsed = path.parse(file);

                const fileName = parsed.name;
                const fileExt = parsed.ext.slice(1);
                const fullName = path.basename(fullPath);

                const sizeInBytes = stats.size;
                const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";

                console.log('file Data : ',sizeInBytes,sizeInMB)

                const exitingFile = await prisma.dataset.findUnique({
                    where: {
                        name: fullName
                    }
                });

                if (!exitingFile) {
                    await prisma.dataset.create({
                        data: {
                            name: fullName,
                            baseName: fileName,
                            ext: fileExt,
                            sizeBytes: sizeInMB,
                        },
                    });


                }
            }


        }

        const allDataSets = await prisma.dataset.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        });

        console.log(allDataSets);

        return allDataSets;

    }

}


export async function getDataSetByIdService(dataSetId) {


    try {
        const dataSet = await prisma.dataset.findUnique({
            where: {
                id: dataSetId
            }
        });

        if (!dataSet) {
            throw new Error("Dataset not found");
        }

        let sampleRows = [];
        let columns = [];

        const filePath = path.join(rootDir, dataSet.fullName);

        if (fs.existsSync(filePath)) {

            //json files
            if (dataSet.ext === 'json') {
                const fileContent = fs.readFileSync(fullPath, 'utf8');
                const parsedData = JSON.parse(fileContent);

                if (Array.isArray(parsedData)) {
                    sampleRows = parsedData.slice(0, 10);
                    if (sampleRows.length > 0) columns = Object.keys(sampleRows[0]);
                } else if (typeof parsedData === 'object' && parsedData !== null) {
                    sampleRows = [parsedData];
                    columns = Object.keys(parsedData);
                }
            }

            // 2. CSV / TSV Files
            if (dataSet.ext === 'csv' || dataSet.ext === 'tsv') {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const parsedData = Papa.parse(fileContent, {
                    header: true,
                    skipEmptyLines: true,
                    delimiter: dataset.ext === 'tsv' ? '\t' : ','
                });

                columns = parsedData.meta.fields || [];
                sampleRows = parsedData.data.slice(0, 10);
            }


        }

        return {
            ...dataSet,
            columns,
            sampleRows
        }




    }
    catch (err) {

        console.error(`Error in getDatasetByIdService [ID: ${id}]:`, error.message);

        throw error;



    }


}