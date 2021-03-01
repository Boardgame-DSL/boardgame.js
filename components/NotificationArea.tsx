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
	}

	public componentDidMount(): void {
		(window as any).boardgame.addEventListener("invalidInput", this.onInvalidInput.bind(this));
		(window as any).boardgame.addEventListener("invalidMove", this.onInvalidMove.bind(this));
		(window as any).boardgame.initialized.then(this.onInitialized.bind(this));
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
		(window as any).boardgame.removeEventListener("invalidInput", this.onInvalidInput.bind(this));
		(window as any).boardgame.removeEventListener("invalidMove", this.onInvalidMove.bind(this));
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
