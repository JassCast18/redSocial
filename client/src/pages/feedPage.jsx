import Feed from "../components/feed";
import CreatePostForm from "../components/CreatePostForm";

function FeedPage() {
  const handlePostCreated = (newPost) => {
    // Aquí puedes hacer algo como recargar el feed o actualizar el estado
    console.log("Nueva publicación:", newPost);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <CreatePostForm onPostCreated={handlePostCreated} />
      <Feed />
    </div>
  );
}

export default FeedPage;
