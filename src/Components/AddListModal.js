import React, { Component } from 'react';
import {
	Text,
	StyleSheet,
	View,
	KeyboardAvoidingView,
	TouchableOpacity,
	TextInput,
	Animated,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../Colors';

export default class AddListModal extends Component {
	backgroundColors = ['#5cd859', '#24a6d9', '#595bd9', '#8022d9', '#d159d8', '#d85963', '#d88559'];
	state = {
		name: '',
		color: this.backgroundColors[0],
	};

	renderColors() {
		return this.backgroundColors.map(color => {
			return (
				<TouchableOpacity
					key={color}
					style={[styles.colorSelect, { backgroundColor: color }]}
					onPress={() => this.setState({ color })}
				/>
			);
		});
	}

	createTodo = () => {
		const { name, color } = this.state;

		if (name) {
			const list = { name, color };
			this.props.addList(list);
			this.setState({ name: '' });
			this.props.closeModal();
		}
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
	render() {
		return (
			<KeyboardAvoidingView style={styles.container}>
				<TouchableOpacity
					style={{ position: 'absolute', top: 64, right: 32 }}
					onPress={this.props.closeModal}>
					<AntDesign name='close' size={24} color={Colors.black} />
				</TouchableOpacity>

				<View style={{ alignSelf: 'stretch', marginHorizontal: 32 }}>
					<Text style={styles.title}>Create Todo List</Text>
					<TextInput
						style={styles.input}
						placeholder='List name?'
						onChangeText={text => this.setState({ name: text })}
					/>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
						{this.renderColors()}
					</View>
					<TouchableOpacity
						style={[styles.create, { backgroundColor: this.state.color }]}
						onPress={this.createTodo}>
						<Text style={{ color: Colors.white, fontWeight: '600' }}>Create</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 28,
		fontWeight: '800',
		color: Colors.black,
		alignSelf: 'center',
		marginBottom: 16,
	},
	input: {
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.blue,
		borderRadius: 6,
		height: 50,
		marginTop: 8,
		paddingHorizontal: 16,
		fontSize: 18,
	},
	create: {
		marginTop: 24,
		height: 50,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	colorSelect: {
		height: 30,
		width: 30,
		borderRadius: 4,
	},
});
