import { useSelector } from 'react-redux';

function useSortPosts(userFilteringTopics, arrayName) {
  const { userPosts, sortCriteria, sortOrder } = useSelector((state) => state.userPostsReducer);
  const { allPosts, filterByPopularity, filteringTopics } = useSelector((state) => state.allPostsReducer);

  if (arrayName !== 'allPosts') {
    const sortedPosts = userPosts[arrayName].filter((post) => {
      return !!post.topics.reduce(((accumulator, topic) => accumulator += (userFilteringTopics.includes(topic)) ? 1 : 0), 0);
    });

    if (sortCriteria === 'Reactions' && sortOrder === 1) {
      sortedPosts.sort((a, b) => a.reactions.length - b.reactions.length);
    }
    else if (sortCriteria === 'Reactions' && sortOrder === 2) {
      sortedPosts.sort((a, b) => b.reactions.length - a.reactions.length);
    }
    else if (sortCriteria === 'Publish date' && sortOrder === 1) {
      sortedPosts.sort((a, b) => b.publishDate - a.publishDate);
    }
    else if (sortCriteria === 'Publish date' && sortOrder === 2) {
      sortedPosts.sort((a, b) => a.publishDate - b.publishDate);
    }
    else {
      sortedPosts.sort((a, b) => b.publishDate - a.publishDate);
    }

    return sortedPosts;
  } else {
    let sortedPosts = allPosts.filter((post) => {
      return !!post.topics.reduce(((accumulator, topic) =>
        accumulator += (filteringTopics.includes(topic) || filteringTopics.length === 0) ? 1 : 0), 0);
    });

    if (filterByPopularity === 'Popular') {
      sortedPosts.sort((a, b) => b.reactions.length - a.reactions.length);
    }
    else if (filterByPopularity === 'Marked') {
      sortedPosts.sort((a, b) => b.marked.length - a.marked.length);
    }
    else {
      sortedPosts.sort((a, b) => b.publishDate - a.publishDate);
    }

    return sortedPosts;
  }
}

export default useSortPosts;
