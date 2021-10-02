import firebase from 'firebase';
import '@firebase/firestore';
import config from '../../config';

const firebaseConfig = {
	apiKey: config.API_KEY,
	authDomain: config.AUTH_DOMAIN,
	databaseURL: config.DATABASE_URL,
	projectId: config.PROJECT_ID,
	storageBucket: config.STORAGE_BUCKET,
	messagingSenderId: config.MESSAGING_SENDER_ID,
	appId: config.APP_ID,
};

class Fire {
	constructor(callback) {
		this.init(callback);
	}
	init(callback) {
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				callback(null, user);
			} else {
				firebase
					.auth()
					.signInAnonymously()
					.catch(err => {
						console.log('[firebase.js:25] - err ', err);
						callback(err);
					});
			}
		});
	}

	getLists(callback) {
		let ref = this.ref.orderBy('name');
		this.unsubscribe = ref.onSnapshot(snapshot => {
			let lists = [];

			snapshot.forEach(doc => {
				lists.push({ id: doc.id, ...doc.data() });
			});
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
