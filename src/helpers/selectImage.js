const selectThumbnail = async (e) => {

    const file = e.currentTarget.files[0]
  
    if (file.size > MAX_IMAGE_SIZE) {
      setNotification({ message: "Image Must be Less then and Equal to 512kb", type: "error" })
      e.currentTarget.value = ''
      return
    }
    // setthumbnailFile(file)
    // setThumbnail(file)
    const reader = new FileReader()
    reader.onload = () => {
      setThumbailURL(reader.result)
    }
    reader.readAsDataURL(file)
  }