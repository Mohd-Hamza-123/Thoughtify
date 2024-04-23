import React, { useState, useEffect, useRef } from 'react'
import './RespondersSectionPage.css'
import { useSelector, useDispatch } from "react-redux";
import { useAskContext } from '../context/AskContext';
import appwriteService from '../appwrite/config';
import { getResponderInitialPosts } from '../store/postsSlice';
import { UpperNavigationBar, LowerNavigationBar, HorizontalLine, HomeRight, PostCard } from '../components';
const RespondersSectionPage = () => {

    const dispatch = useDispatch();
    const initialTrustedPosts = useSelector((state) => state.postsSlice.initialResponderPosts)
    // console.log(initialTrustedPosts)


    const { increaseViews, hasMorePostInTrustedPost,
        sethasMorePostInTrustedPost, isDarkModeOn } = useAskContext();

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const [lastPostID, setLastPostID] = useState(null)
    const [isIntersecting, setIsIntersecting] = useState(false)

    const [maximumPostsNumber, setmaximumPostsNumber] = useState(null)

    let spinnerRef = useRef();

    useEffect(() => {
        const getAllPosts = async () => {
            setIsLoading((prev) => true)
            try {
                if (initialTrustedPosts.length === 0) {
                    const posts = await appwriteService.getPosts({ lastPostID, TrustedResponders: true })
                    setmaximumPostsNumber((prev) => posts.total)
                    if (initialTrustedPosts.length < posts.total) {
                        sethasMorePostInTrustedPost((prev) => true)
                    } else {
                        sethasMorePostInTrustedPost((prev) => false)
                    }
                    if (posts) {
                        setPosts((prev) => posts.documents)
                        let lastID = posts.documents[posts.documents.length - 1]?.$id
                        setLastPostID((prev) => lastID)
                        dispatch(getResponderInitialPosts({ initialResponderPosts: posts.documents }))
                    }
                } else {
                    // console.log(initialPost)
                    setPosts((prev) => [...initialTrustedPosts])
                }
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            } finally {
                // setIsLoading((prev) => false)
            }
        }
        getAllPosts();
    }, []);

    useEffect(() => {
        const ref = spinnerRef.current;
        // console.log(ref)
        if (ref) {
            const observer = new IntersectionObserver(([entry]) => {
                setIsIntersecting((prev) => entry.isIntersecting)
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 1
            })

            observer.observe(ref)
            return () => ref && observer.unobserve(ref)
        }

    }, [spinnerRef.current, posts])

    useEffect(() => {
        // console.log(maximumPostsNumber)
        if (isIntersecting && hasMorePostInTrustedPost) {
            const getAllPosts = async () => {
                // console.log(initialPost[initialPost.length - 1].$id)
                let LastID = initialTrustedPosts[initialTrustedPosts.length - 1]?.$id;
                const posts = await appwriteService.getPosts({ lastPostID: LastID, TrustedResponders: true })
                // console.log(posts)
                // setPosts((prev) => [...prev, posts])
                if (initialTrustedPosts.length < posts.total) {
                    sethasMorePostInTrustedPost((prev) => true)
                } else {
                    sethasMorePostInTrustedPost((prev) => false)
                }
                setmaximumPostsNumber((prev) => posts.total)
                if (posts.documents.length === 0) {
                    setIsLoading((prev) => false)
                    return
                }
                let lastID = posts.documents[posts.documents.length - 1].$id
                setLastPostID((prev) => lastID)
                dispatch(getResponderInitialPosts({ initialResponderPosts: posts.documents }))
            }
            getAllPosts()
        }
        // console.log(initialPost)
    }, [isIntersecting, hasMorePostInTrustedPost])

    useEffect(() => {
        if (initialTrustedPosts.length !== 0) {
            setPosts((prev) => initialTrustedPosts)
        } else {
            setPosts((prev) => [])
        }
    }, [initialTrustedPosts])


    const RespondersSectionPageRef = useRef()

    const lastScrollY = useRef(window.scrollY);
    const [isNavbarHidden, setisNavbarHidden] = useState(false)


    const handleScroll = (e) => {
        let position = e.target.scrollTop;

        sessionStorage.setItem('scrollPosition', position.toString());
        if (lastScrollY.current < position) {
            // console.log('down')
            setisNavbarHidden(true)
        } else {
            // console.log('up')
            setisNavbarHidden(false)
        }
        // setlastScrollY(position)
        lastScrollY.current = position
    }

    console.log(isNavbarHidden)
    useEffect(() => {
        // console.log(RespondersSectionPageRef.current)
        if (RespondersSectionPageRef.current) {
            // console.log("HOme")
            const storedScrollPosition = sessionStorage.getItem('scrollPosition');
            const parsedScrollPosition = parseInt(storedScrollPosition, 10);
            // console.log(parsedScrollPosition)
            RespondersSectionPageRef.current.scrollTop = parsedScrollPosition
        }
    }, [RespondersSectionPageRef.current, posts]);

    return (
        <div
            id="ResponderSectionPage"
            ref={RespondersSectionPageRef}
            className="w-full relative"
            onScroll={handleScroll}
        >
            <nav className={`Home_Nav_Container w-full text-center ${isNavbarHidden ? 'active' : ''} ${isDarkModeOn ? "darkMode" : ''}`}>
                <UpperNavigationBar />
                <HorizontalLine />
                <LowerNavigationBar />
            </nav>

            <div id="Home_RIGHT_LEFT" className={`flex gap-5 px-8 py-5 w-full`}>
                <div className="Home_Left flex flex-col gap-6">
                    {posts?.map((post) => {

                        return <div className={`RespondersSectionPage_PostCard ${isDarkModeOn ? 'darkMode' : ''}`} key={post?.$id} onClick={() => increaseViews(post.$id)}>
                            <PostCard {...post} isTrustedresponded={true} />
                        </div>
                    })}

                    {(isLoading && hasMorePostInTrustedPost) && <div ref={spinnerRef} className="flex justify-center">
                        <span className="Home_loader"></span>
                    </div>}

                </div>
                <div className={`Home_Right ${isNavbarHidden ? '' : 'active'}`}>
                    <HomeRight />
                </div>
            </div>
        </div>
    )
}

export default RespondersSectionPage