import { AppDataSource } from "../db/typeorm_config";
import { AuditLog } from "../entities/Audit_log";
import { kafkaProducer } from "./kafka";
import { AppEvent } from "./publishEvent";

export const logEvent = async (event: AppEvent) => {
  const repo = AppDataSource.getRepository(AuditLog);
  const auditEntry = repo.create({
    ...event,
    timestamp: new Date().toISOString(),
    actorId: event.actorId !== undefined ? Number(event.actorId) : undefined,
    description: event.description ?? 'No description add yet', // Default to empty string if not provided
  });
  await repo.save(auditEntry);

   // ✅ Publish to Kafka
  await kafkaProducer.send({
    topic: event.event, // topic = "user.registered" etc.
    messages: [{ value: JSON.stringify(event) }],
  });
  // await publishEvent(event.event, event.payload, event.actorId);
};
