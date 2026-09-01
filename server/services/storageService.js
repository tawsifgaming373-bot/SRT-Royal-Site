function assertHostedImageUrl(value) {
  if (typeof value !== 'string' || value.length > 2048 || !/^https:\/\//i.test(value)) {
    const error = new Error('Storage must return an HTTPS image URL.');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

async function uploadImage() {
  const error = new Error('Image storage provider is not configured.');
  error.statusCode = 503;
  throw error;
}

module.exports = { assertHostedImageUrl, uploadImage };
