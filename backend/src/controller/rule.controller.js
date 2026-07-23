import { createRuleService } from '../service/rule.service.js';

export async function createRuleController(req, res) {
    try {
        const payload = req.body;

        const result = await createRuleService(payload);

        return res.status(201).json({
            success: true,
            message: `${result.count} validation rules saved successfully`,
            data: result
        });

    } catch (error) {
        console.error("Create Rule Controller Error:", error.message);

        const statusCode = error.message.includes("not found") || error.message.includes("Invalid") ? 400 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}