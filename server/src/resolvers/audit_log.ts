import { Resolver, Query, Arg, Int } from "type-graphql";
import { AuditLog } from "../entities/Audit_log";
import { AppDataSource } from "../db/typeorm_config";

@Resolver()
export class AuditLogResolver {
  @Query(() => [AuditLog])
  async auditLogs(): Promise<AuditLog[]> {
    const repo = AppDataSource.getRepository(AuditLog);
    const logs = await repo.find({ order: { timestamp: 'DESC' } });
    // console.log('[AuditLogResolver] Returning logs:', logs);
    return logs;
  }

  //? Logs by user ID
  @Query(() => [AuditLog])
  async auditLogsByUser(
    @Arg("userId", () => Int) userId: number
  ): Promise<AuditLog[]> {
    const repo = AppDataSource.getRepository(AuditLog);
    return await repo.find({
      where: { actorId: userId },
      order: { timestamp: 'DESC' },
    });
  };

  //* Logs by Kafka event type
  @Query(() => [AuditLog])
  async auditLogsByEvent(
    @Arg("event", () => String) event: string
  ): Promise<AuditLog[]> {
    const repo = AppDataSource.getRepository(AuditLog);
    return await repo.find({
      where: { event },
      order: { timestamp: 'DESC' },
    });
  }
}