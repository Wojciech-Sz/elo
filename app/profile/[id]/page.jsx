"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  useSearchParams,
  useParams,
} from "next/navigation";

import Profile from "@components/Profile";

const Profiles = () => {
  const { data: session } = useSession([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const name =
    session?.user.id === params.id
      ? "My"
      : searchParams.get("name");
  const desc =
    session?.user.id === params.id
      ? "Welcome to your personalized profile page"
      : `Welcome to ${name} personalized profile page`;

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(
        `/api/users/${params.id}/posts`
      );
      const data = await res.json();

      setPosts(data);
    };
    if (params.id) fetchPost();
  }, [params.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt."
    );
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
        const filteredPosts = posts.filter(
          (p) => p._id !== post._id
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name={name}
      desc={desc}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default Profiles;
