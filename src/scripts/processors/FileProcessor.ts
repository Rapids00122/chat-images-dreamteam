import { FilePickerImplementation, ORIGIN_FOLDER, randomString, t, userCanUpload } from '../utils/Utils'
import { addClass, append, create, find, on, remove, removeClass } from '../utils/JqueryWrappers'
import imageCompression from 'browser-image-compression'
import { getUploadingStates } from '../components/Loader'
import { getSetting } from '../utils/Settings'

/**
 * Represents a single image selected/queued for chat.
 *
 * - `type`     → MIME type (e.g. "image/png")
 * - `name`     → original filename from disk
 * - `file`     → File object (for local uploads only)
 * - `imageSrc` → either a DataURL, a remote URL, or a final uploaded path
 * - `id`       → random ID used to identify its DOM preview and filename base
 */
export type SaveValueType = {
  type?: string,
  name?: string,
  file?: File,
  imageSrc: string | ArrayBuffer | null,
  id: string,
}

/**
 * Any image coming from these domains will be rejected when pasted/dropped
 * (to avoid hot-linking from certain sites).
 */
const RESTRICTED_DOMAINS = ['static.wikia']

/**
 * Shared DOMParser instance used to parse HTML from clipboard/drag data.
 */
const DOM_PARSER = new DOMParser()

/**
 * Global queue of images currently attached to the chat input.
 * When the user sends a message, this is typically read and then cleared.
 */
let imageQueue: SaveValueType[] = []

/**
 * Checks whether a File or DataTransferItem is an image based on its MIME type.
 */
const isFileImage = (file: File | DataTransferItem) => {
  // @ts-ignore – DataTransferItem has .type at runtime
  const result = file.type && file.type.startsWith('image/')
  console.log('[CI:DEBUG] isFileImage →', { file, isImage: result })
  return result
}

/**
 * Creates the DOM snippet for an image preview block in the upload area.
 * This includes:
 * - wrapper div with unique ID
 * - remove (X) icon
 * - img tag for the preview
 */
const createImagePreview = ({ imageSrc, id }: SaveValueType): JQuery => {
  console.log('[CI:DEBUG] createImagePreview →', { id, imageSrc })
  return create(
    `<div id="${id}" class="ci-upload-area-image">
        <i class="ci-remove-image-icon fa-regular fa-circle-xmark"></i>
        <img class="ci-image-preview" src="${imageSrc}" alt="${t('unableToLoadImage')}"/>
     </div>`
  )
}

/**
 * Adds a click handler to the "remove image" icon on each preview.
 * When clicked:
 * - removes the preview from the DOM
 * - removes the corresponding entry from imageQueue
 * - hides the upload area if no images remain
 */
const addEventToRemoveButton = (removeButton: JQuery, saveValue: SaveValueType, uploadArea: JQuery) => {
  console.log('[CI:DEBUG] addEventToRemoveButton → binding remove for id', saveValue.id)

  const removeEventHandler = () => {
    console.log('[CI:DEBUG] removeEventHandler → CLICKED for id', saveValue.id)

    const image = find(`#${saveValue.id}`, uploadArea)
    console.log('[CI:DEBUG] removeEventHandler → found image element', image)

    remove(image)
    imageQueue = imageQueue.filter((imgData: SaveValueType) => saveValue.id !== imgData.id)
    console.log('[CI:DEBUG] removeEventHandler → updated imageQueue', imageQueue)

    if (imageQueue.length) {
      console.log('[CI:DEBUG] removeEventHandler → images still in queue, not hiding uploadArea')
      return
    }

    console.log('[CI:DEBUG] removeEventHandler → queue empty, hiding uploadArea')
    addClass(uploadArea, 'hidden')
  }

  on(removeButton, 'click', removeEventHandler)
}

/**
 * Compresses and uploads a single image file to Foundry's file system.
 *
 * Steps:
 * 1. Generate a new filename based on the image's id and extension.
 * 2. Compress the image (up to ~1.5MB, preserving resolution).
 * 3. Upload via FilePickerImplementation to the configured uploadLocation.
 * 4. Return the uploaded file path, or fall back to the original imageSrc on error.
 */
const uploadImage = async (saveValue: SaveValueType): Promise<string> => {
  const generateFileName = (saveValue: SaveValueType) => {
    const { type, name, id } = saveValue
    const fileExtension: string =
      name?.substring(name.lastIndexOf('.'), name.length) ||
      type?.replace('image/', '.') ||
      '.jpeg'
    const result = `${id}${fileExtension}`
    console.log('[CI:DEBUG] generateFileName →', { name, type, id, fileExtension, result })
    return result
  }

  try {
    console.log('[CI:DEBUG] uploadImage → START', saveValue)

    const newName = generateFileName(saveValue)
    console.log('[CI:DEBUG] uploadImage → newName', newName)

    const compressedImage = await imageCompression(saveValue.file as File, {
      maxSizeMB: 1.5,
      useWebWorker: true,
      alwaysKeepResolution: true,
    })
    console.log('[CI:DEBUG] uploadImage → compressedImage', compressedImage)

    const newImage = new File([compressedImage as File], newName, { type: saveValue.type })
    console.log('[CI:DEBUG] uploadImage → newImage', newImage)

    const uploadLocation = getSetting('uploadLocation')
    console.log('[CI:DEBUG] uploadImage → uploadLocation', uploadLocation)

    // @ts-ignore – FilePickerImplementation type is not fully known here
    const imageLocation = await FilePickerImplementation().upload(
      ORIGIN_FOLDER,
      uploadLocation,
      newImage,
      {},
      { notify: false }
    )

    console.log('[CI:DEBUG] uploadImage → upload result', imageLocation)

    if (!imageLocation || !(imageLocation as FilePicker.UploadReturn)?.path) {
      console.warn(
        '[CI:DEBUG] uploadImage → no path returned from upload, falling back to original imageSrc',
        imageLocation
      )
      return saveValue.imageSrc as string
    }

    const path = (imageLocation as FilePicker.UploadReturn).path
    console.log('[CI:DEBUG] uploadImage → returning path', path)
    return path
  } catch (e) {
    console.error('[CI:DEBUG] uploadImage → ERROR, falling back to imageSrc', e)
    return saveValue.imageSrc as string
  }
}

/**
 * Core function that takes a SaveValueType and:
 * - (optionally) uploads the file to Foundry if it has a local File
 * - creates a preview DOM block
 * - shows the upload area
 * - pushes the image into the global imageQueue
 * - wires up the remove button
 *
 * NOTE: This is kept structurally identical to your original code.
 * The only additions are logging calls and comments.
 */
const addImageToQueue = async (saveValue: SaveValueType, sidebar: JQuery) => {
  console.log('[CI:DEBUG] addImageToQueue → START', { saveValue, sidebar })

  const uploadingStates = getUploadingStates(sidebar)
  console.log('[CI:DEBUG] addImageToQueue → got uploadingStates', uploadingStates)

  uploadingStates.on()
  console.log('[CI:DEBUG] addImageToQueue → uploadingStates.on() called')

  const uploadArea: JQuery = find('#ci-chat-upload-area', sidebar)
  console.log('[CI:DEBUG] addImageToQueue → uploadArea lookup', uploadArea)

  // EARLY RETURN PATH #1: upload area missing
  if (!uploadArea || !uploadArea[0]) {
    console.warn('[CI:DEBUG] addImageToQueue → uploadArea NOT FOUND, returning early WITHOUT turning spinner off')
    return
  }

  if (saveValue.file) {
    console.log('[CI:DEBUG] addImageToQueue → saveValue has file, checking permissions', saveValue.file)

    if (!userCanUpload()) {
      console.warn('[CI:DEBUG] addImageToQueue → userCanUpload() = FALSE, turning spinner off and returning')
      uploadingStates.off()
      return
    }

    console.log('[CI:DEBUG] addImageToQueue → userCanUpload() = TRUE, calling uploadImage')
    saveValue.imageSrc = await uploadImage(saveValue)
    console.log('[CI:DEBUG] addImageToQueue → uploadImage finished, updated imageSrc', saveValue.imageSrc)
  } else {
    console.log('[CI:DEBUG] addImageToQueue → no file present (likely URL/paste)', saveValue.imageSrc)
  }

  console.log('[CI:DEBUG] addImageToQueue → creating image preview')
  const imagePreview = createImagePreview(saveValue)
  console.log('[CI:DEBUG] addImageToQueue → imagePreview result', imagePreview)

  // EARLY RETURN PATH #2: no preview created
  if (!imagePreview || !imagePreview[0]) {
    console.warn(
      '[CI:DEBUG] addImageToQueue → imagePreview is EMPTY, returning early WITHOUT turning spinner off'
    )
    return
  }

  console.log('[CI:DEBUG] addImageToQueue → showing uploadArea and appending preview')
  removeClass(uploadArea, 'hidden')
  append(uploadArea, imagePreview)

  imageQueue.push(saveValue)
  console.log('[CI:DEBUG] addImageToQueue → pushed to imageQueue', imageQueue)

  const removeButton = find('.ci-remove-image-icon', imagePreview)
  console.log('[CI:DEBUG] addImageToQueue → removeButton lookup', removeButton)

  addEventToRemoveButton(removeButton, saveValue, uploadArea)
  console.log('[CI:DEBUG] addImageToQueue → remove event bound')

  uploadingStates.off()
  console.log('[CI:DEBUG] addImageToQueue → uploadingStates.off() called, END')
}

/**
 * Handler factory used when reading files via FileReader.
 * For each file:
 * - FileReader reads it as DataURL
 * - when loaded, this handler is called
 * - a SaveValueType is created and passed to addImageToQueue
 */
const imagesFileReaderHandler =
  (file: File, sidebar: JQuery) =>
  async (evt: Event) => {
    const imageSrc = (evt.target as FileReader)?.result
    console.log('[CI:DEBUG] imagesFileReaderHandler → file loaded', { file, imageSrc })

    const saveValue: SaveValueType = {
      type: file.type,
      name: file.name,
      imageSrc,
      id: randomString(),
      file,
    }

    console.log('[CI:DEBUG] imagesFileReaderHandler → constructed saveValue', saveValue)
    await addImageToQueue(saveValue, sidebar)
  }

/**
 * Handles a FileList or array of File objects (e.g. from <input type="file">).
 * For each image file:
 * - sets up a FileReader
 * - reads it as DataURL
 * - on load, delegates to imagesFileReaderHandler
 */
export const processImageFiles = (files: FileList | File[], sidebar: JQuery) => {
  console.log('[CI:DEBUG] processImageFiles → START, files length', files.length)

  for (let i = 0; i < files.length; i++) {
    const file: File = files[i]
    console.log('[CI:DEBUG] processImageFiles → inspecting file', file)

    if (!isFileImage(file)) {
      console.warn('[CI:DEBUG] processImageFiles → skipping non-image file', file)
      continue
    }

    console.log('[CI:DEBUG] processImageFiles → processing image file', file)

    const reader: FileReader = new FileReader()
    reader.addEventListener('load', imagesFileReaderHandler(file, sidebar))
    reader.readAsDataURL(file)
  }

  console.log('[CI:DEBUG] processImageFiles → END')
}

/**
 * Handles drag-and-drop or paste events coming from a DataTransfer.
 * It attempts two paths:
 * 1. If the DataTransfer includes HTML with <img> tags, it extracts img.src URLs.
 *    - rejects if any come from restricted domains
 *    - queues each URL as an image (no upload, just link)
 * 2. Otherwise, it extracts File objects from DataTransfer.items and delegates to processImageFiles.
 */
export const processDropAndPasteImages = (eventData: DataTransfer, sidebar: JQuery) => {
  console.log('[CI:DEBUG] processDropAndPasteImages → START', eventData)

  const extractUrlFromEventData = (eventData: DataTransfer): string[] | null => {
    const html = eventData.getData('text/html')
    console.log('[CI:DEBUG] extractUrlFromEventData → raw html', html)

    if (!html) {
      console.log('[CI:DEBUG] extractUrlFromEventData → no html in eventData')
      return null
    }

    const doc = DOM_PARSER.parseFromString(html, 'text/html')
    const images = doc.querySelectorAll('img')
    console.log('[CI:DEBUG] extractUrlFromEventData → found <img> elements', images)

    if (!images || !images.length) {
      console.log('[CI:DEBUG] extractUrlFromEventData → no <img> tags found')
      return null
    }

    // @ts-ignore – spread NodeList
    const imageUrls = [...images].map((img) => (img.src as string))
    console.log('[CI:DEBUG] extractUrlFromEventData → imageUrls', imageUrls)

    const imagesContainRestrictedDomains = imageUrls.some((iu) =>
      RESTRICTED_DOMAINS.some((rd) => iu.includes(rd))
    )
    console.log('[CI:DEBUG] extractUrlFromEventData → restricted domain check', {
      imageUrls,
      imagesContainRestrictedDomains,
    })

    if (imagesContainRestrictedDomains) {
      console.warn('[CI:DEBUG] extractUrlFromEventData → URLs contain restricted domains, returning null')
      return null
    }

    return imageUrls
  }

  const urlsFromEventDataHandler = async (urls: string[]) => {
    console.log('[CI:DEBUG] urlsFromEventDataHandler → START with urls', urls)
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      const saveValue: SaveValueType = { imageSrc: url, id: randomString() }
      console.log('[CI:DEBUG] urlsFromEventDataHandler → queuing URL', saveValue)
      await addImageToQueue(saveValue, sidebar)
    }
    console.log('[CI:DEBUG] urlsFromEventDataHandler → END')
  }

  // First try to interpret the event as containing HTML with image URLs
  const urls: string[] | null = extractUrlFromEventData(eventData)
  if (urls && urls.length) {
    console.log('[CI:DEBUG] processDropAndPasteImages → URLs detected, handling as URL paste/drop')
    return urlsFromEventDataHandler(urls)
  }

  // If that fails, fall back to pulling File objects from the DataTransfer items
  const extractFilesFromEventData = (eventData: DataTransfer): File[] => {
    const items: DataTransferItemList = eventData.items
    const files: File[] = []
    console.log('[CI:DEBUG] extractFilesFromEventData → items', items)

    for (let i = 0; i < items.length; i++) {
      const item: DataTransferItem = items[i]
      console.log('[CI:DEBUG] extractFilesFromEventData → inspecting item', item)

      if (!isFileImage(item)) {
        console.warn('[CI:DEBUG] extractFilesFromEventData → skipping non-image item', item)
        continue
      }

      const file = item.getAsFile()
      console.log('[CI:DEBUG] extractFilesFromEventData → item.getAsFile()', file)

      if (!file) {
        console.warn('[CI:DEBUG] extractFilesFromEventData → item.getAsFile() returned null, skipping')
        continue
      }

      files.push(file)
    }

    console.log('[CI:DEBUG] extractFilesFromEventData → extracted files', files)
    return files
  }

  const files: File[] = extractFilesFromEventData(eventData)
  if (files && files.length) {
    console.log('[CI:DEBUG] processDropAndPasteImages → files detected, delegating to processImageFiles')
    return processImageFiles(files, sidebar)
  }

  console.log('[CI:DEBUG] processDropAndPasteImages → no URLs or files found, nothing to do')
}

/**
 * Returns the current queue of images attached to the chat input.
 * Typically used by the message-sending logic to build markup.
 */
export const getImageQueue = (): SaveValueType[] => {
  console.log('[CI:DEBUG] getImageQueue →', imageQueue)
  return imageQueue
}

/**
 * Clears the entire imageQueue and removes all preview DOM elements
 * from the upload area in the sidebar.
 */
export const removeAllFromQueue = (sidebar: JQuery) => {
  console.log('[CI:DEBUG] removeAllFromQueue → START')

  while (imageQueue.length) {
    const imageData: SaveValueType | undefined = imageQueue.pop()
    console.log('[CI:DEBUG] removeAllFromQueue → popped imageData', imageData)

    if (!imageData) continue

    const imageElement = find(`#${imageData.id}`, sidebar)
    console.log('[CI:DEBUG] removeAllFromQueue → removing element', imageElement)

    remove(imageElement)
  }

  const uploadArea: JQuery = find('#ci-chat-upload-area', sidebar)
  console.log('[CI:DEBUG] removeAllFromQueue → found uploadArea', uploadArea)

  addClass(uploadArea, 'hidden')
  console.log('[CI:DEBUG] removeAllFromQueue → END, queue cleared and uploadArea hidden')
}
