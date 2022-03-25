# Polybar Yesplaymusic Lyrics

🎼在Polybar上显示YesPlayMusic的歌词

### 预览

- 单独使用  
  ![single](/images/single.png)
- 与[ploybar-mpris-control](https://github.com/KairuiLiu/ploybar-mpris-control)搭配使用  
  ![comb](/images/comb.png)

### 配置

- 将 `/lyric` 移动到 `~/.config/polybar/scripts/`
- 在`~/.config/polybar/scripts/`下执行
  
  ```bash
  pnpm install
  ```
  
- 在 `config.ini` 中添加模块  

  ```ini
  modules-left = ypm-lyric
  ```

- 添加模块配置

  ```ini
  [module/ypm-lyric]
  type = custom/script
  tail = true
  interval = 1
  format = <label>
  exec = ~/.config/polybar/scripts/lyric/lyric.bash
  ```

- 模块会在YesPlayMusic播放时自动显示歌词, 在关闭YesPlayMusic时自动清除内容

### 延迟与自定义

虽然采取了一些手段来降低延迟, 但是延迟依旧是客观存在的, **消除延迟最好的方法就是一次显示两条歌词**😂. 注释掉`app.js`的56行, 并解除57-60行注释即可实现两条同时显示