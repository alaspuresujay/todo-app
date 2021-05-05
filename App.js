import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import Colors from './Colors';
import { AntDesign } from '@expo/vector-icons';
import tempData from './tempData';
import TodoList from './Components/TodoList';
import AddListModal from './Components/AddListModal';
export default class App extends React.Component {
	state = {
		addTodoVisible: false,
		lists: tempData,
	};

	toggleAddTodoVisible() {
		this.setState({ addTodoVisible: !this.state.addTodoVisible });
	}

	renderList = (list) => {
		return <TodoList list={list} updateList={this.updateList} />;
	};

	addList = (list) => {
		this.setState({
			lists: [...this.state.lists, { ...list, id: this.state.lists.length + 1, todos: [] }],
		});
	};

	updateList = (list) => {
		this.setState({
			lists: this.state.lists.map((item) => {
				return item.id === list.id ? list : item;
			}),
		});
	};
	render() {
		return (
			<View style={styles.container}>
				<Modal
					animationType='slide'
					visible={this.state.addTodoVisible}
					onRequestClose={() => this.toggleAddTodoVisible()}>
					<AddListModal closeModal={() => this.toggleAddTodoVisible()} addList={this.addList} />
				</Modal>
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
						keyExtractor={(item) => item.name}
						horizontal
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => this.renderList(item)}
						keyboardShouldPersistTaps='always'
					/>
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