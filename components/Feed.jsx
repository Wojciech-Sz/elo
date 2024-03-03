"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleTagClick = (tag) => setSearchText(tag);

  const filteredPosts = () => {
    const filteredPostsList = posts.filter(
      (post) =>
        post.prompt
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        post.tag
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        post.creator.username
          .toLowerCase()
          .includes(searchText.toLowerCase())
    );
    return filteredPostsList;
  };

  const fetchPost = async () => {
    const res = await fetch("/api/prompt");
    const data = await res.json();

    setPosts(data);
  };
  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList
        data={searchText ? filteredPosts() : posts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
