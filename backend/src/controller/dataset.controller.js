import { scanDataSetService, getDataSetByIdService } from '../service/dataset.service.js';

/**
 * 1. Scan / Sync All Datasets
 * GET /api/datasets/scan (ya GET /api/datasets)
 */
export async function scanDataSetController(req, res) {
    try {
        const datasets = await scanDataSetService();

        return res.status(200).json({
            success: true,
            count: datasets.length,
            message: "Datasets scanned and synced successfully",
            data: datasets
        });

    } catch (error) {
        console.error("Scan Dataset Controller Error:", error);

        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to scan and fetch datasets",
            errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

/**
 * 2. Get Single Dataset Details + Sample Preview Rows
 * GET /api/datasets/:id
 */
export async function getDatasetByIdController(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Dataset ID is required"
            });
        }

        const datasetData = await getDataSetByIdService(id);

        return res.status(200).json({
            success: true,
            data: datasetData
        });

    } catch (error) {
        console.error("Get Dataset By ID Controller Error:", error);

        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to fetch dataset details",
            errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}