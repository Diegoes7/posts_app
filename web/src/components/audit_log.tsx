'use client';

import React from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Text,
	Box,
	Code,
	Spinner,
	useDisclosure,
	Select,
	HStack,
	Tooltip,
} from '@chakra-ui/react';

import {
	useAuditLogsQuery,
	useAuditLogsByUserLazyQuery,
	useAuditLogsByEventLazyQuery,
	User,
} from '../generated/graphql';
import { ViewIcon } from '@chakra-ui/icons';
import EmptyState from './empty_state';

type AuditLogViewerProps = {
	user?: User | null;
};

export default function AuditLogViewer({ user }: AuditLogViewerProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [filterEvent, setFilterEvent] = React.useState<string>('');
	const [logs, setLogs] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<any>(null);

	const { data: allLogsData } = useAuditLogsQuery();
	const [fetchByUser] = useAuditLogsByUserLazyQuery();
	const [fetchByEvent] = useAuditLogsByEventLazyQuery();

	React.useEffect(() => {
		if (isOpen && allLogsData?.auditLogs?.length) {
			setLogs(allLogsData.auditLogs);
		}
	}, [isOpen, allLogsData]);

	const handleUserLogs = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await fetchByUser({ variables: { userId: user?.id! } });
			setLogs(data?.auditLogsByUser || []);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleEventChange = React.useCallback(
		async (event: React.ChangeEvent<HTMLSelectElement>) => {
			const selectedEvent = event.target.value;
			setFilterEvent(selectedEvent);

			if (!selectedEvent) {
				setLogs(allLogsData?.auditLogs || []);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const { data } = await fetchByEvent({
					variables: { event: selectedEvent },
				});
				setLogs(data?.auditLogsByEvent || []);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const handleAllLogs = React.useCallback(() => {
		setLogs(allLogsData?.auditLogs || []);
	}, [allLogsData]);

	React.useEffect(() => {}, [isOpen]);

	const displayedLogs = logs.length > 0 ? logs : allLogsData?.auditLogs || [];

	return (
		<>
			<Tooltip fontSize='small' label="See Kafka's events">
				<Button
					bg='#2D3748'
					color='#fff'
					_hover={{ color: '#313844', bg: '#fff' }}
					fontSize={{ base: 'sm', sm: 'sm', md: 'md' }}
					px={{ base: 3, sm: 4, md: 6 }}
					py={{ base: 2, sm: 2, md: 3 }}
					onClick={onOpen}
					leftIcon={<ViewIcon />}
				>
					View Audit Logs
				</Button>
			</Tooltip>

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='4xl'
				scrollBehavior='inside'
			>
				<ModalOverlay />
				<ModalContent width={'95%'} maxWidth='1200px'>
					<ModalHeader>Audit Log Records</ModalHeader>
					<ModalCloseButton />
					<ModalBody p={0} position='relative'>
						<Box
							position='sticky'
							top='0'
							zIndex='10'
							bg='white'
							p={4}
							borderBottom='1px solid #E2E8F0'
						>
							<HStack mb={4} gap={4} alignItems='center' flexWrap='wrap'>
								<Tooltip fontSize='small' label='View your logs'>
									<Button size='sm' colorScheme='teal' onClick={handleUserLogs}>
										Auth User Logs: {user ? user.username : 'No Logged in User'}
									</Button>
								</Tooltip>
								<Tooltip fontSize='small' label='Admin privilege'>
									<Button
										size='sm'
										title=''
										colorScheme='teal'
										onClick={handleAllLogs}
									>
										All Users Logs
									</Button>
								</Tooltip>

								<Select
									placeholder='Filter by event...'
									size='sm'
									maxW='250px'
									value={filterEvent}
									onChange={handleEventChange}
									title='Admin privilege to see all events'
								>
									<option value='post.created'>Created Posts</option>
									<option value='post.updated'>Updated Posts</option>
									<option value='post.deleted'>Deleted Posts</option>
									<option value='user.loggedin'>Logged In User</option>
									<option value='user.deleted'>User Deleted</option>
									<option value='user.loggedout'>Logged Out User</option>
									<option value='user.registered'>Registered User</option>
									<option value='user.post-bonus'>Post Bonus Pts</option>
									<option value='user.bonus-awarded'>User Bonus Pts</option>
								</Select>
							</HStack>
						</Box>

						{loading && (
							<Box py={6} textAlign='center'>
								<Spinner size='lg' />
							</Box>
						)}

						{error && (
							<Text color='red.500'>
								Error loading logs: <Box>{error.message}</Box>
							</Text>
						)}

						{!loading && logs.length === 0 && (
							<EmptyState
								message={
									filterEvent
										? `No logs found for event "${filterEvent}".`
										: user
										? 'No audit logs found for this user.'
										: 'No audit logs available yet.'
								}
							/>
						)}

						{displayedLogs.map((log) => (
							<Box key={log.id} borderBottom='1px solid #e2e8f0' px={4} py={2}>
								<Text fontWeight='bold' color='blue.600'>
									{log.event}
								</Text>
								<Text fontSize='sm' color='gray.700'>
									{log.description}
								</Text>
								<Text fontSize='xs' color='gray.500'>
									{new Date(log.timestamp).toLocaleString()}
								</Text>
								{log.payload && (
									<Box mt={2}>
										<Code
											whiteSpace='pre-wrap'
											fontSize='xs'
											p={2}
											background='gray.50'
											width='100%'
											display='block'
										>
											{JSON.stringify(log.payload, null, 2)}
										</Code>
									</Box>
								)}
							</Box>
						))}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
