const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

async function reqLyrics() {
  const st = new Date();
  const playerRes = await fetch('http://127.0.0.1:27232/player').then(
    (response) => response.json(),
    (response) => {
      console.log('');
      process.exit(1);
    }
  );
  let lyrics = await fs.readFileSync(
    path.join(__dirname, '.lyric.json'),
    'utf8'
  );
  if (lyrics) {
    lyrics = JSON.parse(lyrics);
    if (lyrics.id !== playerRes.currentTrack.id) lyrics = null;
  }
  if (!lyrics) {
    const lyricsRes = await fetch(
      `http://127.0.0.1:10754/lyric?id=${playerRes.currentTrack.id}`
    ).then((response) => response.json());
    lyrics = {
      id: playerRes.currentTrack.id,
      lyrics: lyricsRes.lrc.lyric.split('\n').map((d) => {
        const reg = /^\[([0-9]{2}):([0-9]{2})\.([0-9]*)\](.*)/.exec(d);
        if (reg)
          return {
            time:
              Number.parseInt(reg[1], 10) * 60 +
              Number.parseInt(reg[2], 10) +
              Number.parseInt(reg[3], 10) / 1000,
            text: reg[4],
          };
        return { time: Number.MAX_SAFE_INTEGER, text: '' };
      }),
    };
    await fs.writeFileSync(
      path.join(__dirname, '.lyric.json'),
      JSON.stringify(lyrics),
      {}
    );
  }
  const ed = new Date();
  return {
    pos: playerRes.progress + Number.parseFloat((ed - st) / 1000),
    lyrics: lyrics.lyrics,
  };
}

function checkLyrics(pos, lyric) {
  return pos - lyric.time + 0.5;
}

function findLyrics(pos, lyrics) {
  let l = 0;
  let r = lyrics.length - 1;
  while (l < r) {
    const mid = (l + r) >> 1;
    const ck = checkLyrics(pos, lyrics[mid]);
    if (ck === 0) return mid;
    else if (ck < 0) r = mid - 1;
    else if (checkLyrics(pos, lyrics[mid + 1]) <= 0) return mid;
    else l = mid + 1;
  }
  return l;
}

(async () => {
  const { pos, lyrics } = await reqLyrics();
  const lyricIdx = findLyrics(pos, lyrics);
  let lyricl = lyrics[lyricIdx].text;
  if (!lyricl) lyricl = '...';
  console.log(lyricl);
  // let lyricr = lyrics[lyricIdx + 1].text;
  // if (!lyricr) lyricr = '...';
  // console.log(lyricl + ' / ' + lyricr);
})();
