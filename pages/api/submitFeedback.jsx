import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { questionId, mockId, feedback, rating } = JSON.parse(req.body);

		try {
			await db.insert(UserAnswer).values({
				mockIdRef: mockId,
				question: questionId,
				feedback,
				rating,
			});
			res.status(200).json({ success: true });
		} catch (error) {
			res.status(500).json({ success: false, error: error.message });
		}
	} else {
		res.status(405).json({ success: false, error: "Method not allowed" });
	}
}
