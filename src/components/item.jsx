import { Card, Space, Image, Tag, Typography } from 'antd';
import './item.scss';

const { Meta, Grid } = Card;
const { Paragraph, Text, Title } = Typography;

export function MovieItem() {
	return (
		<>
			<Space
				style={{
					display: 'flex',
					width: 1010,
					height: 570,
					alignItems: 'flex-start',
					flexWrap: 'wrap',
					backgroundColor: 'GrayText',
				}}
			>
				<Card hoverable style={{ height: 280, padding: 1 }}>
					<Grid
						style={{
							maxHeight: 280,
						}}
					>
						<Meta
							style={{ width: 405, textAlign: 'start' }}
							title={
								<Title level={3} style={{ margin: 0 }}>
									The way back
								</Title>
							}
							description={
								<>
									<Text type='secondary'>March 5, 2020 </Text>
									<Paragraph style={{ margin: 5, marginLeft: 0 }}>
										<Tag>Action</Tag>
										<Tag>Drama</Tag>
									</Paragraph>
									<Paragraph>
										A former basketball all-star, who has lost his wife and
										family foundation in a struggle with addiction attempts to
										regain his soul and salvation by becoming the coach of a
										disparate ethnically mixed high ...
									</Paragraph>
								</>
							}
							avatar={
								<Image
									src='https://s3-alpha-sig.figma.com/img/d1ed/f372/ad16f84b4351c548ad40efff6081bd5e?Expires=1675641600&Signature=qMkksfw3eaH8tEif-iOFrN57DGpY7~sEQN~RJg52XZwca7bZSmZeiiyPudMBscJs8xwrficQH8vCpHMDKZBaPNrwDM8WkKQsvkwfQRepjI0HmG74WGy86TkbZiGhUfDeJiel3yPBuOBBNwqDTOxMHSiWDM~xCkA64P5SY1w2vFSaQgOH9Pu1sApKZ-b4gFGqbytAdqEYu~yAjdJWNqjIfhtfznypMyRkN4YpqkYQIKRo~khEEmUM6WAPa0gCCmz6y3YHcIonP07hTzUjNX1Voy~neTpiSefxX8l~ywID3-6YJpt0kJRzItMQ1F5iRTHmytuF4fhLn~iii-wKSq86vg__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4'
									width={153}
									height={240}
								/>
							}
						/>
					</Grid>
				</Card>
			</Space>
		</>
	);
}
