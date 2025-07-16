import { Link } from "react-router-dom";

import { instaService } from "../services/insta/insta.service";

import { useSelector } from 'react-redux'

import { useState, useEffect } from 'react'

import { loadPosts } from "../store/posts.actions";

import { PostsIndex } from "../cmps/PostsIndex"

export function HomePage() {


const posts = useSelector(storeState => storeState.postsModule.posts)

useEffect(() =>{

    loadPosts()

}, [])


    return (
        <main className="posts-conatiner">

            <PostsIndex posts={posts} />


          
        </main>
    )
}

