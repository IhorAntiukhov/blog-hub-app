import { useSelector } from 'react-redux';

function useSortPosts(userFilteringTopics, arrayToSort) {
  const { userPosts, sortCriteria, sortOrder } = useSelector((state) => state.userPostsReducer);
  const { allPosts, filterByPopularity, filteringTopics } = useSelector((state) => state.allPostsReducer);

  if (arrayToSort === 'userPosts') {
    const sortedPosts = userPosts.filter((post) => {
      return !!post.topics.reduce(((accumulator, topic) => accumulator += (userFilteringTopics.includes(topic)) ? 1 : 0), 0);
    });

    if (sortCriteria === 'Reactions' && sortOrder === 1) {
      sortedPosts.sort((a, b) => a.reactions.length - b.reactions.length);
    }
    else if (sortCriteria === 'Reactions' && sortOrder === 2) {
      sortedPosts.sort((a, b) => b.reactions.length - a.reactions.length);
    }
    else if (sortCriteria === 'Publish date' && sortOrder === 1) {
      sortedPosts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
    }
    else if (sortCriteria === 'Publish date' && sortOrder === 2) {
      sortedPosts.sort((a, b) => a.publishDate.getTime() - b.publishDate.getTime());
    }
    else {
      sortedPosts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
    }

    return sortedPosts;
  } else {
    let sortedPosts = allPosts.filter((post) => {
      return !!post.topics.reduce(((accumulator, topic) =>
        accumulator += (filteringTopics.includes(topic) || filteringTopics.length === 0) ? 1 : 0), 0);
    });

    if (filterByPopularity === 'Popular') {
      sortedPosts.sort((a, b) => a.reactions.length - b.reactions.length);
    }
    else if (filterByPopularity === 'Trending') {
      sortedPosts = [...sortedPosts.filter((post) => {
        const now = new Date();
        return ((now.getTime() - post.publishDate.getTime()) < 604800000);
      })]
      sortedPosts.sort((a, b) => a.reactions.length - b.reactions.length);
    }
    else {
      sortedPosts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
    }

    return sortedPosts;
  }
}

export default useSortPosts;
