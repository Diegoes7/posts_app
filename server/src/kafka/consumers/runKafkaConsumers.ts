import { runPostCreate, runPostDelete, runPostRead, runPostUpdate, runUserDeleted, runUserForgotPassword, runUserLogin, runUserLogout, runUserPasswordChanged, runUserRegister, runUserUpdated, runUserVoted } from './generic_consumer';
import { runPostCreatedBonusConsumer, runUserGiftBonusConsumer } from './runBonusPoints';

export const runKafkaConsumers = async () => {
	try {
		await Promise.all([
			runUserRegister(),
			runUserLogin(),
			runUserLogout(),
			runUserPasswordChanged(),
			runUserForgotPassword(),
			runUserUpdated(),
			runUserDeleted(),

			runUserGiftBonusConsumer(),
			runPostCreatedBonusConsumer(),
			runUserVoted(),

			runPostCreate(),
			runPostUpdate(),
			runPostDelete(),
			runPostRead(),
		]);
		console.log('✅ All Kafka consumers started');
	} catch (error) {
		console.error('❌ Error starting Kafka consumers:', error);
	}
};
