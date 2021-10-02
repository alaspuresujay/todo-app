import React from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Modal,
	LogBox,
	ActivityIndicator,
	Animated,
	StatusBar,
} from 'react-native';

import Colors from './Colors';
import { AntDesign } from '@expo/vector-icons';

import TodoList from './src/Components/TodoList';
import AddListModal from './src/Components/AddListModal';
import Fire from './src/Components/firebase';

export default class App extends React.Component {
	state = {
		addTodoVisible: false,
		lists: [],
		user: {},
		loading: true,
		ballAnimation: new Animated.Value(0),
		currTime: null,
	};
	componentDidMount() {
		setInterval(() => {
			this.setState({
				curTime: new Date().toLocaleString(),
			});
		}, 1000);
		LogBox.ignoreLogs(['Setting a timer ']);
		// @ts-ignore
		firebase = new Fire((err, user) => {
			if (err) {
				return alert('Something went wrong');
			}
			// @ts-ignore
			firebase.getLists(lists => {
				this.setState({ lists, user }, () => {
					this.setState({ loading: false });
				});
			});
			this.setState({ user });
		});
	}

	componentWillUnmount() {
		// @ts-ignore
		firebase.detach();
	}
	toggleAddTodoVisible() {
		this.setState({ addTodoVisible: !this.state.addTodoVisible });
	}

	renderList = list => {
		return <TodoList list={list} updateList={this.updateList} />;
	};
	rightActions = (dragX, index) => {
		return (
			<TouchableOpacity onPress={() => console.log('[TodoModal.js:67] - touch ')}>
				<Animated.View>
					<Animated.Text>Delete</Animated.Text>
				</Animated.View>
			</TouchableOpacity>
		);
	};

	addList = list => {
		// @ts-ignore
		firebase.addList({
			name: list.name,
			color: list.color,
			todos: [],
		});
	};

	updateList = list => {
		// @ts-ignore
		firebase.updateList(list);
	};

	render() {
		if (this.state.loading) {
			return (
				<View style={styles.container}>
					<ActivityIndicator size='large' color={Colors.blue} />
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<StatusBar backgroundColor='#fff' />
				<Modal
					animationType='slide'
					visible={this.state.addTodoVisible}
					onRequestClose={() => this.toggleAddTodoVisible()}>
					<AddListModal closeModal={() => this.toggleAddTodoVisible()} addList={this.addList} />
				</Modal>

				<View>
					<Text style={{ marginTop: 15 }}>Date: {this.state.curTime}</Text>
				</View>

				<View style={{ flexDirection: 'row' }}>
					<View style={styles.divider} />
					<Text style={styles.title}>
						Todo <Text style={{ fontWeight: '300', color: Colors.blue }}>Lists</Text>
					</Text>
					<View style={styles.divider} />
				</View>

				<View style={{ marginVertical: 48 }}>
					<TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodoVisible()}>
						<AntDesign name='plus' size={16} color={Colors.blue} />
					</TouchableOpacity>
					<Text style={styles.add}>Add List</Text>
				</View>

				<View style={{ height: 275, marginLeft: 0 }}>
					<FlatList
						data={this.state.lists}
						keyExtractor={item => item.id.toString()}
						horizontal
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => this.renderList(item)}
						keyboardShouldPersistTaps='always'
					/>
				</View>
				<View>
					<Text>User: {this.state.user.uid}</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	divider: {
		backgroundColor: Colors.lightBlue,
		height: 1,
		flex: 1,
		alignSelf: 'center',
	},
	title: {
		fontSize: 30,
		fontWeight: '800',
		color: Colors.black,
		paddingHorizontal: 64,
	},
	todoContainer: {
		paddingVertical: 16,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 0.5,
	},
	addList: {
		borderWidth: 2,
		borderColor: Colors.lightBlue,
		borderRadius: 4,
		padding: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	add: {
		color: Colors.blue,
		fontWeight: '600',
		fontSize: 14,
		marginTop: 8,
	},
});
