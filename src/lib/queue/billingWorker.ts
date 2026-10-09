import { Worker, Queue, Job } from "bullmq";
import prisma from "@/lib/prisma";
import { connection } from "./redis";

// Fila responsável pelos resets de bilhetagem
export const billingQueue = new Queue("billingReset", { connection });

// Adiciona os jobs recorrentes se não existirem
export async function setupBillingCronJobs() {
  await billingQueue.upsertJobScheduler(
    "daily-reset-scheduler",
    { pattern: "0 0 * * *" },
    {
      name: "dailyReset",
      data: {},
      opts: {}
    }
  );

  await billingQueue.upsertJobScheduler(
    "weekly-reset-scheduler",
    { pattern: "0 0 * * 0" },
    {
      name: "weeklyReset",
      data: {},
      opts: {}
    }
  );

  await billingQueue.upsertJobScheduler(
    "monthly-reset-scheduler",
    { pattern: "0 0 1 * *" },
    {
      name: "monthlyReset",
      data: {},
      opts: {}
    }
  );

  console.log("[Billing] Cron jobs de bilhetagem configurados.");
}

// Worker para processar os resets
export const billingWorker = new Worker(
  "billingReset",
  async (job: Job) => {
    console.log(`[Billing Worker] Executando job de reset: ${job.name}`);

    if (job.name === "dailyReset") {
      await prisma.subscription.updateMany({
        data: {
          tokensUsedDaily: 0,
          lastDailyReset: new Date(),
        },
      });
      console.log(`[Billing Worker] Reset diário concluído.`);
    }

    if (job.name === "weeklyReset") {
      await prisma.subscription.updateMany({
        data: {
          tokensUsedWeekly: 0,
          lastWeeklyReset: new Date(),
        },
      });
      console.log(`[Billing Worker] Reset semanal concluído.`);
    }

    if (job.name === "monthlyReset") {
      await prisma.subscription.updateMany({
        data: {
          tokensUsedMonthly: 0,
          lastMonthlyReset: new Date(),
        },
      });
      console.log(`[Billing Worker] Reset mensal concluído.`);
    }
  },
  { connection }
);

billingWorker.on("completed", (job) => {
  console.log(`[Billing Worker] Job ${job.id} concluído com sucesso.`);
});

billingWorker.on("failed", (job, err) => {
  console.error(`[Billing Worker] Job ${job?.id} falhou: ${err.message}`);
});
