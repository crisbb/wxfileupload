Page({
  data: {
    fileName: '',
    uploadStatus: '',
    uploadId: ''
  },

  onUploadTap() {
    wx.requirePrivacyAuthorize({
      serviceType: 'chooseMessageFile',
      desc: '需要授权访问文件以选择简历上传',
      success: () => {
        this.chooseResumeFile();
      },
      fail: (err) => {
        console.error('requirePrivacyAuthorize failed', err);
        wx.showToast({
          title: '授权失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
  },

  chooseResumeFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        if (res && res.tempFiles && res.tempFiles.length > 0) {
          const file = res.tempFiles[0];
          const fileName = file.name || '已选文件';
          this.setData({
            fileName,
            uploadStatus: '正在上传文件...', 
            uploadId: ''
          });

          wx.uploadFile({
            url: 'https://your-server.example.com/api/uploadResume',
            filePath: file.path,
            name: 'file',
            formData: {
              fileName
            },
            success: (uploadRes) => {
              let data = {};
              try {
                data = JSON.parse(uploadRes.data);
              } catch (err) {
                console.error('解析上传返回值失败', err, uploadRes.data);
              }

              if (uploadRes.statusCode === 200 && data && data.success) {
                this.setData({
                  uploadStatus: '上传完成，点击导入文心App',
                  uploadId: data.fileId || data.uploadId || ''
                });
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1500
                });
              } else {
                this.setData({ uploadStatus: '上传失败，请重试' });
                wx.showToast({
                  title: '上传失败',
                  icon: 'none',
                  duration: 1500
                });
                console.error('uploadFile response error', uploadRes, data);
              }
            },
            fail: (err) => {
              this.setData({ uploadStatus: '上传失败' });
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 1500
              });
              console.error('uploadFile failed', err);
            }
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '取消选择',
          icon: 'none',
          duration: 1500
        });
        console.error('chooseMessageFile failed', err);
      }
    });
  },

  onImportTap() {
    if (!this.data.uploadId) {
      wx.showToast({
        title: '请先上传文件',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    wx.navigateBackMiniProgram({
      extraData: {
        uploadId: this.data.uploadId,
        fileName: this.data.fileName
      },
      success: () => {
        wx.showToast({
          title: '已返回文心App',
          icon: 'success',
          duration: 1500
        });
      },
      fail: (err) => {
        console.error('navigateBackMiniProgram failed', err);
        wx.showToast({
          title: '返回失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
  }
});
