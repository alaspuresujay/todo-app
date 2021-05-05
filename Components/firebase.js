import firebase from 'firebase';
// import 'firebase/auth';
import '@firebase/firestore';
// import 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyCq7pOWGXxtQdQfZMj2oOKWQlXe9MvLnJ8',
	authDomain: 'clone-project-sujay.firebaseapp.com',
	// databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: 'clone-project-sujay',
	storageBucket: 'clone-project-sujay.appspot.com',
	messagingSenderId: '419718453701',
	appId: '1:419718453701:web:513af44e87860a5e9153ac',
};

class Fire {
	constructor(callback) {
		this.init(callback);
	}
	init(callback) {
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				callback(null, user);
			} else {
				firebase
					.auth()
					.signInAnonymously()
					.catch((err) => {
						console.log('[firebase.js:25] - err ', err);
						callback(err);
					});
			}
		});
	}

	getLists(callback) {
		let ref = this.ref.orderBy('name');
		this.unsubscribe = ref.onSnapshot((snapshot) => {
			let lists = [];

			snapshot.forEach((doc) => {
				lists.push({ id: doc.id, ...doc.data() });
			});
			// console.log('[firebase.js:48] - list ', lists);
			callback(lists);
		});
	}

	addList(list) {
		let ref = this.ref;
		ref.add(list);
	}

	updateList(list) {
		let ref = this.ref;
		ref.doc(list.id).update(list);
	}

	get userId() {
		return firebase.auth().currentUser.uid;
	}
	get ref() {
		return firebase.firestore().collection('todoapp').doc(this.userId).collection('lists');
	}

	detach() {
		this.unsubscribe();
	}
}

export default Fire;
