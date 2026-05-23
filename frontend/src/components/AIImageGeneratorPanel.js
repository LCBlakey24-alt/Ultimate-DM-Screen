import ImageUploadPanel from '@/components/ImageUploadPanel';

/**
 * Deprecated compatibility wrapper.
 *
 * Rookie Quest Keeper no longer supports AI image generation.
 * This component remains only so older, not-yet-refactored screens that import
 * AIImageGeneratorPanel do not break the build. It delegates to the upload-only
 * ImageUploadPanel and must not call any image-generation service.
 */
export default function AIImageGeneratorPanel(props) {
  const title = String(props.title || 'Upload Image')
    .replace(/AI\s*/gi, '')
    .replace(/Generated\s*/gi, '')
    .replace(/Generation\s*/gi, '')
    .replace(/Artwork/gi, 'Artwork Upload')
    .trim() || 'Upload Image';

  return (
    <ImageUploadPanel
      {...props}
      title={title}
      subtitle="Upload your own image. AI image generation is not available in Rookie Quest Keeper."
      uploadLabel={props.uploadLabel || props.buttonLabel || 'Upload image'}
    />
  );
}
