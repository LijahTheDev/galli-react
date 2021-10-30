import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { AiFillHeart } from 'react-icons/ai'
import ProfilePost from '../components/ProfilePost'
import { ImSpinner9 } from 'react-icons/im'
import NumberFormat from 'react-number-format';

const Profile = () => {
    const username = localStorage.getItem('galli_username')
    const userQuery = useQuery('user', async () => await axios.get(`http://localhost:7000/api/users/username/${username}`))
    const user = userQuery.data?.data

    useEffect(async () => {
        userQuery.refetch()
    }, []);

    const renderUserPosts = () => {
        return user.posts.length > 0 ? user.posts
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map(p => (
                <Fragment key={p.id}>
                    <ProfilePost
                        id={p.id}
                        image={p.image_url}
                        numOfLikes={p.favorites.length}
                        numOfComments={p.comments.length}
                        favorites={p.favorites}
                        refetch={userQuery.refetch}
                    />
                </Fragment>
            )) : <p className="font-bold text-center">No Posts Yet</p>
    }

    return user ? (
        <div>
            <div className="flex flex-col justify-center items-center gap-4 mt-10 mb-5">
                <img className="rounded-full w-48 shadow-xl" src={user.avatar_url} alt={username} />
                <h2 className="font-inter font-bold text-3xl">{username}</h2>
            </div>
            {console.log(user.total_hearts)}
            <div className="flex justify-center items-center gap-2 mb-10">
                <AiFillHeart size="2.5rem" className="text-red-500 drop-shadow-xl" />
                <h2 className="font-inter font-bold text-lg text-red-500">
                    <NumberFormat value={user.total_hearts} displayType={'text'} thousandSeparator={true} />
                </h2>
            </div>

            <div className="mb-10 md:w-4/6 lg:w-1/2 xl:w-1/3 md:mx-auto">
                <h3 className="font-inter font-bold ml-5 mb-1">{user.first_name} {user.last_name}</h3>
                <p className="font-inter font-thin px-5">
                    {user.bio ? user.bio : '...'}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 px-5 pb-10">
                {renderUserPosts()}
            </div>
        </div>
    ) : (
        <div className="flex justify-center items-center">
            <ImSpinner9 className="animate-spin text-7xl m-10" />
        </div>
    )
}

export default Profile