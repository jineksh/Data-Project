import { prisma } from '../config/databse.js'


export async function createRuleService(payload) {
    try {
        const datasetId = Number(payload.datasetId || payload.id);

        if (!datasetId || isNaN(datasetId)) {
            throw new Error("Invalid or missing Dataset ID");
        }

        const dataSet = await prisma.dataset.findUnique({
            where: {
                id: datasetId
            }
        });

        if (!dataSet) {
            throw new Error("Dataset not found");
        }

        const validationRules = payload.queries || [];

        if (!Array.isArray(validationRules) || validationRules.length === 0) {
            throw new Error("No queries/rules provided for bulk insert");
        }

        const rulesData = validationRules.map((r) => ({
            rule: r,
            datasetId: datasetId
        }));

        const result = await prisma.validationRule.createMany({
            data: rulesData
        });

        return result;

    } catch (error) {
        console.error("Error in createRuleService:", error.message);
        throw error;
    }
}