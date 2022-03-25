const fetch = require('node-fetch');

function form2bit(v) {
  if (v < 10) return '0' + v;
  return '' + v;
}

async function reqLyrics() {
  const st = new Date();
  const playerRes = await fetch('http://127.0.0.1:27232/player').then(
    (response) => response.json(),
    (response) => {
      console.log('');
      process.exit(1);
    }
  );
  const lyricsRes = await fetch(
    `http://127.0.0.1:10754/lyric?id=${playerRes.currentTrack.id}`
  ).then((response) => response.json());
  const ed = new Date();
  return {
    pos: playerRes.progress + Number.parseFloat((ed - st) / 1000),
    lyrics: lyricsRes.lrc.lyric.split('\n'),
  };
}

function checkLyrics(pos, lyric) {
  const reg = /^\[([0-9]{2}):([0-9]{2})\.([0-9]*)/.exec(lyric);
  cur =
    Number.parseInt(reg[1], 10) * 60 +
    Number.parseInt(reg[2], 10) +
    Number.parseInt(reg[3], 10) / 1000;
  return pos - cur + 0.5;
}

function findLyrics(pos, lyrics) {
  let l = 0;
  let r = lyrics.length - 2;
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
  const lyricl =
    lyrics[lyricIdx].replace(/\[([0-9]{2}):([0-9]{2})\.([0-9]*)\]/, '') ||
    '...';
  // const lyricr =
  //   lyrics[lyricIdx + 1].replace(/\[([0-9]{2}):([0-9]{2})\.([0-9]*)\]/, '') ||
  //   '...';
  console.log(lyricl);
})();
