"use server";

import { inngest } from "../../../inngest/client";
import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";
import { generateSlug } from "random-word-slugs";
import { getCurrentUser } from "@/modules/auth/actions";
import { consumeCredits } from "@/lib/usage";

export const getProjects = async () => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const projects = await db.project.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return projects;
};

export const createProject = async (value) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    try {
        await consumeCredits();
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            throw new Error("Unauthorized");
        }
        
        // Check if it's a rate limit error (rate-limiter-flexible throws when points are exhausted)
        if (error?.remainingPoints === 0 || (error instanceof Error && error.message.includes("points"))) {
             throw new Error("Insufficient credits. Please upgrade your plan.");
        }

        throw new Error("Something went wrong while consuming credits.");
    }

    const newProject = await db.project.create({
        data: {
            name: generateSlug(2, { format: "kebab" }),
            userId: user.id,
            messages: {
                create: {
                    content: value,
                    role: MessageRole.USER,
                    type: MessageType.RESULT,
                },
            },
        },
    });

    await inngest.send({
        name: "code-agent/run",
        data: {
            value: value,
            projectId: newProject.id,
        },
    });

    return newProject;
};

export const getProjectById = async (projectId) => {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const project = await db.project.findUnique({
        where: {
            id: projectId,
            userId: user.id,
        },
    });

    if (!project) throw new Error("Project not found");

    return project;
};
