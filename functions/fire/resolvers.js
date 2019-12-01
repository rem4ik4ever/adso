const allPosts = async (_, args, { admin }) => {
  try {
    const db = admin.firestore();
    const postsCollection = db.collection("posts");

    const response = await postsCollection.get();
    let data = [];
    response.forEach(documentSnapshot => {
      if (documentSnapshot.exists) {
        data.push(documentSnapshot.data());
      }
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const createPost = async (_, { title, description }, { admin }) => {
  try {
    const db = admin.firestore();
    const postsCollection = db.collection("posts");

    const response = await postsCollection.add({ title, description });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = { allPosts, createPost };
