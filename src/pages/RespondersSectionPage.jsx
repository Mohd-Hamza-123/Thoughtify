import React, { useState, useEffect, useRef } from 'react'
import './RespondersSectionPage.css'
import { useSelector, useDispatch } from "react-redux";
import { useAskContext } from '../context/AskContext';
import appwriteService from '../appwrite/config';
import { getResponderInitialPosts } from '../store/postsSlice';
import { UpperNavigationBar, LowerNavigationBar, HorizontalLine, HomeRight, PostCard } from '../components';
const RespondersSectionPage = () => {

    const dispatch = useDispatch();
    const initialTrustedPosts = useSelector((state) => state?.postsSlice?.initialResponderPosts);
   

    const { increaseViews, hasMorePostInTrustedPost,
        sethasMorePostInTrustedPost, isDarkModeOn } = useAskContext();

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const [lastPostID, setLastPostID] = useState(null)
    const [isIntersecting, setIsIntersecting] = useState(false)

    const [maximumPostsNumber, setmaximumPostsNumber] = useState(null)

    let spinnerRef = useRef();
    const homeRight = useRef();
    const homeLeft = useRef()

    useEffect(() => {
        const getAllPosts = async () => {
            setIsLoading((prev) => true);
            try {
                if (initialTrustedPosts?.length === 0) {
                    const posts = await appwriteService.getPosts({ lastPostID, TrustedResponders: true });
                    setmaximumPostsNumber((prev) => posts?.total)
                    if (initialTrustedPosts?.length < posts?.total) {
                        sethasMorePostInTrustedPost((prev) => true)
                    } else {
                        sethasMorePostInTrustedPost((prev) => false)
                    }
                    if (posts) {
                        setPosts((prev) => posts.documents)
                        let lastID = posts.documents[posts.documents.length - 1]?.$id
                        setLastPostID((prev) => lastID);
                        dispatch(getResponderInitialPosts({ initialResponderPosts: posts.documents }))
                    }
                } else {
                    setPosts((prev) => [...initialTrustedPosts])
                }
            } catch (error) {
                setIsLoading(false)
            }
        }
        getAllPosts();
    }, []);

    useEffect(() => {
        const ref = spinnerRef.current;
      
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

        if (isIntersecting && hasMorePostInTrustedPost) {

            const getAllPosts = async () => {
                let LastID = initialTrustedPosts[initialTrustedPosts.length - 1]?.$id;
                const posts = await appwriteService.getPosts({ lastPostID: LastID, TrustedResponders: true })

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
      
    }, [isIntersecting, hasMorePostInTrustedPost, initialTrustedPosts])

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
            
            setisNavbarHidden(true)
        } else {
     
            setisNavbarHidden(false)
        }
  
        lastScrollY.current = position
    }

    useEffect(() => {
       
        if (RespondersSectionPageRef.current) {
     
            const storedScrollPosition = sessionStorage.getItem('scrollPosition');
            const parsedScrollPosition = parseInt(storedScrollPosition, 10);
    
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
                <div
                    onClick={() => {
                        if (homeLeft.current && homeRight.current) {
                            homeLeft.current.classList.toggle("none");
                            // homeRight.current.classList.toggle("none");
                        }
                    }}
                    className="Home_RIGHT_LEFT_Grid_div">
                    <button
                        className="flex justify-center items-center">
                        <i className='bx bxs-grid-alt'></i>
                    </button>
                </div>
                <div
                    ref={homeLeft}
                    className="Home_Left flex flex-col gap-6">
                    {posts?.map((post) => {

                        return <div className={`RespondersSectionPage_PostCard ${isDarkModeOn ? 'darkMode' : ''}`} key={post?.$id} onClick={() => increaseViews(post.$id)}>
                            <PostCard {...post} isTrustedresponded={true} />
                        </div>
                    })}

                    {(isLoading && hasMorePostInTrustedPost) && <div ref={spinnerRef} className="flex justify-center">
                        <span className="Home_loader"></span>
                    </div>}

                </div>
                <div
                    ref={homeRight}
                    className={`Home_Right ${isNavbarHidden ? '' : 'active'}`}>
                    <HomeRight />
                </div>
            </div>
        </div>
    )
}

export default RespondersSectionPage