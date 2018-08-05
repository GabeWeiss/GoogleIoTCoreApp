var serviceAccountKey = {copy and paste all private key info here}

var firestore = FirestoreApp.getFirestore(serviceAccountKey.client_email, serviceAccountKey.private_key, serviceAccountKey.project_id);
