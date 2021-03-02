import React from "react";
import { Component, ReactNode } from "react";

interface State {
	notifications: ReadonlyArray<Notification>;
}

interface Notification {
	message: string;
	timeoutId: number;
}

export class NotificationArea extends Component<{}, State> {
	public constructor(props: {}) {
		super(props);

		this.state = {
			notifications: new Array<Notification>(),
		};

		this.onInvalidInput = this.onInvalidInput.bind(this);
		this.onInvalidMove = this.onInvalidMove.bind(this);
		this.onInitialized = this.onInitialized.bind(this);
	}

	public componentDidMount(): void {
		window.boardgame.addEventListener("invalidInput", this.onInvalidInput);
		window.boardgame.addEventListener("invalidMove", this.onInvalidMove);
		window.boardgame.initialized.then(this.onInitialized);
	}

	private onInvalidInput(): void {
		this.sendNotification("Invalid input!");
	}
	private onInvalidMove(): void {
		this.sendNotification("Invalid move!");
	}
	private onInitialized(): void {
		this.sendNotification("Game is ready!");
	}

	public sendNotification(message: string): void {
		const notification: Notification = {
			message,
			timeoutId: 0,
		};
		notification.timeoutId = window.setTimeout(
			() => this.setState({ notifications: this.state.notifications.filter(n => n !== notification) }),
			5000
		);
		this.setState({
			notifications: [...this.state.notifications, notification],
		});
	}

	public componentWillUnmount(): void {
		window.boardgame.removeEventListener("invalidInput", this.onInvalidInput);
		window.boardgame.removeEventListener("invalidMove", this.onInvalidMove);
		for (const notification of this.state.notifications) {
			window.clearTimeout(notification.timeoutId);
		}
	}

	public render(): ReactNode {
		return (
			<div className="notification-area">
				{
					this.state.notifications.map(n => (
						<div
							key={n.timeoutId}
							className="notification"
						>
							<p>{n.message}</p>
						</div>
					))
				}
			</div>
		);
	}
}
