const getRawUrl = (url: string): string => {
  const urlData = new URL(url);

  if (urlData.hostname === 'github.com') {
    return url.replace('/blob', '/raw');
  }

  if (urlData.hostname === 'gist.github.com') {
    return url.replace(/\/?$/, '/raw');
  }

  return url;
};

export default getRawUrl;
