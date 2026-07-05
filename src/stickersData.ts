/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  category: string;
  tags: string[];
}

export interface StickerPack {
  id: string;
  name: string;
  icon: string;
  author: string;
  stickers: Sticker[];
  isDownloaded: boolean;
  size: string;
}

export const STICKER_CATEGORIES = [
  "Smileys", "Love", "Funny", "Animals", "Food", 
  "Sports", "Gaming", "Movies", "Travel", "Celebration", 
  "Birthday", "Christmas", "New Year", "Memes", "Reaction"
];

export const INITIAL_STICKERS: Sticker[] = [
  // Smileys
  { id: "st_sm_1", emoji: "😎", name: "Cool Vibe", category: "Smileys", tags: ["cool", "glasses", "smiley", "happy"] },
  { id: "st_sm_2", emoji: "🤪", name: "Goofy Fun", category: "Smileys", tags: ["crazy", "silly", "goofy", "funny"] },
  { id: "st_sm_3", emoji: "🤠", name: "Yeehaw", category: "Smileys", tags: ["cowboy", "happy", "excited"] },
  { id: "st_sm_4", emoji: "😇", name: "Angel", category: "Smileys", tags: ["blessed", "holy", "innocent"] },
  { id: "st_sm_5", emoji: "🥺", name: "Pleading", category: "Smileys", tags: ["cute", "pleading", "sad", "begging"] },

  // Love
  { id: "st_lv_1", emoji: "🥰", name: "In Love", category: "Love", tags: ["hearts", "love", "romantic", "blush"] },
  { id: "st_lv_2", emoji: "💖", name: "Sparkle Heart", category: "Love", tags: ["pink", "glow", "sparkle", "love"] },
  { id: "st_lv_3", emoji: "😘", name: "Blow Kiss", category: "Love", tags: ["kiss", "love", "wink"] },
  { id: "st_lv_4", emoji: "😻", name: "Cat Love", category: "Love", tags: ["cat", "heart", "eyes"] },
  { id: "st_lv_5", emoji: "👩‍❤️‍👨", name: "Couple", category: "Love", tags: ["relationship", "love", "partner"] },

  // Funny
  { id: "st_fn_1", emoji: "🤡", name: "Clown", category: "Funny", tags: ["joke", "silly", "clown", "stupid"] },
  { id: "st_fn_2", emoji: "💩", name: "Poop Glow", category: "Funny", tags: ["poop", "funny", "laugh", "smelly"] },
  { id: "st_fn_3", emoji: "🤠", name: "Giddy Cowboy", category: "Funny", tags: ["funny", "dance", "wild"] },
  { id: "st_fn_4", emoji: "👾", name: "Pixel Alien", category: "Funny", tags: ["game", "retro", "alien"] },

  // Animals
  { id: "st_an_1", emoji: "🦄", name: "Unicorn", category: "Animals", tags: ["magic", "horse", "unicorn", "rainbow"] },
  { id: "st_an_2", emoji: "🐼", name: "Panda", category: "Animals", tags: ["panda", "bear", "lazy", "cute"] },
  { id: "st_an_3", emoji: "🦁", name: "Lion King", category: "Animals", tags: ["lion", "brave", "roar", "cat"] },
  { id: "st_an_4", emoji: "🦊", name: "Sly Fox", category: "Animals", tags: ["fox", "clever", "smart"] },
  { id: "st_an_5", emoji: "🐳", name: "Spouting Whale", category: "Animals", tags: ["whale", "ocean", "sea", "big"] },

  // Food
  { id: "st_fd_1", emoji: "🍕", name: "Pizza Slice", category: "Food", tags: ["pizza", "cheese", "snack", "dinner"] },
  { id: "st_fd_2", emoji: "🍩", name: "Donut Glaze", category: "Food", tags: ["donut", "sweet", "dessert", "pink"] },
  { id: "st_fd_3", emoji: "🍔", name: "Burger Stack", category: "Food", tags: ["burger", "fastfood", "lunch", "beef"] },
  { id: "st_fd_4", emoji: "🥑", name: "Avocado", category: "Food", tags: ["healthy", "green", "guac"] },
  { id: "st_fd_5", emoji: "🍟", name: "Fries", category: "Food", tags: ["fries", "potato", "salty"] },

  // Sports
  { id: "st_sp_1", emoji: "⚽", name: "Soccer Ball", category: "Sports", tags: ["soccer", "football", "goal", "kick"] },
  { id: "st_sp_2", emoji: "🏀", name: "Basketball", category: "Sports", tags: ["basket", "hoop", "dunk", "orange"] },
  { id: "st_sp_3", emoji: "🏆", name: "Trophy Gold", category: "Sports", tags: ["trophy", "winner", "first", "champion"] },
  { id: "st_sp_4", emoji: "🛹", name: "Skateboard", category: "Sports", tags: ["skate", "board", "cool", "flip"] },

  // Gaming
  { id: "st_gm_1", emoji: "🎮", name: "Gamepad Pro", category: "Gaming", tags: ["controller", "game", "play", "playstation"] },
  { id: "st_gm_2", emoji: "🕹️", name: "Joystick Retro", category: "Gaming", tags: ["retro", "arcade", "atari"] },
  { id: "st_gm_3", emoji: "👾", name: "Retro Monster", category: "Gaming", tags: ["alien", "space", "invaders"] },
  { id: "st_gm_4", emoji: "🎯", name: "Bullseye", category: "Gaming", tags: ["aim", "target", "perfect"] },

  // Movies
  { id: "st_mv_1", emoji: "🍿", name: "Popcorn Box", category: "Movies", tags: ["popcorn", "movie", "cinema", "show"] },
  { id: "st_mv_2", emoji: "🎬", name: "Clapperboard", category: "Movies", tags: ["action", "film", "clack", "director"] },
  { id: "st_mv_3", emoji: "🎭", name: "Drama Masks", category: "Movies", tags: ["theatre", "art", "tragedy", "comedy"] },
  { id: "st_mv_4", emoji: "🕶️", name: "SciFi Glasses", category: "Movies", tags: ["cyberpunk", "cool", "matrix"] },

  // Travel
  { id: "st_tr_1", emoji: "✈️", name: "Airplane High", category: "Travel", tags: ["plane", "fly", "trip", "holiday"] },
  { id: "st_tr_2", emoji: "🚀", name: "Rocket Launch", category: "Travel", tags: ["rocket", "space", "mars", "moon"] },
  { id: "st_tr_3", emoji: "🏝️", name: "Island Palm", category: "Travel", tags: ["beach", "sea", "paradise", "sun"] },
  { id: "st_tr_4", emoji: "🧭", name: "Compass", category: "Travel", tags: ["navigation", "direction", "adventure"] },

  // Celebration
  { id: "st_cb_1", emoji: "🎉", name: "Popper", category: "Celebration", tags: ["party", "congrats", "confetti"] },
  { id: "st_cb_2", emoji: "🥳", name: "Party Hat", category: "Celebration", tags: ["excited", "blow", "fun"] },
  { id: "st_cb_3", emoji: "🎈", name: "Red Balloon", category: "Celebration", tags: ["balloon", "fly", "up"] },
  { id: "st_cb_4", emoji: "🍾", name: "Champagne Pop", category: "Celebration", tags: ["drink", "fizz", "sparkle"] },

  // Birthday
  { id: "st_bd_1", emoji: "🎂", name: "Cake Glow", category: "Birthday", tags: ["birthday", "cake", "candles", "sweet"] },
  { id: "st_bd_2", emoji: "🎁", name: "Gift Box", category: "Birthday", tags: ["present", "surprise", "ribbon"] },
  { id: "st_bd_3", emoji: "🧁", name: "Cupcake Cherry", category: "Birthday", tags: ["muffin", "cherry", "frosting"] },

  // Christmas
  { id: "st_ch_1", emoji: "🎄", name: "Xmas Tree", category: "Christmas", tags: ["christmas", "tree", "lights", "santa"] },
  { id: "st_ch_2", emoji: "🎅", name: "Santa Claus", category: "Christmas", tags: ["santa", "claus", "gifts", "holiday"] },
  { id: "st_ch_3", emoji: "⛄", name: "Snowman", category: "Christmas", tags: ["snow", "winter", "cold"] },

  // New Year
  { id: "st_ny_1", emoji: "🎆", name: "Fireworks Night", category: "New Year", tags: ["fireworks", "sky", "celebrate"] },
  { id: "st_ny_2", emoji: "🥂", name: "Cheers Glasses", category: "New Year", tags: ["toast", "drink", "friends"] },
  { id: "st_ny_3", emoji: "🌟", name: "Bright Star", category: "New Year", tags: ["star", "glow", "wishes"] },

  // Memes
  { id: "st_me_1", emoji: "🐸", name: "Pepe Frog", category: "Memes", tags: ["frog", "pepe", "internet", "dank"] },
  { id: "st_me_2", emoji: "🐕", name: "Doge Coin", category: "Memes", tags: ["dog", "doge", "shiba", "wow"] },
  { id: "st_me_3", emoji: "🧠", name: "Galaxy Brain", category: "Memes", tags: ["mind", "blown", "genius", "meme"] },
  { id: "st_me_4", emoji: "🗿", name: "Moai Statue", category: "Memes", tags: ["moai", "stone", "giga", "chad"] },

  // Reaction
  { id: "st_rc_1", emoji: "🤔", name: "Thinking Deep", category: "Reaction", tags: ["hmm", "puzzled", "question"] },
  { id: "st_rc_2", emoji: "🤦", name: "Facepalm", category: "Reaction", tags: ["facepalm", "sigh", "disbelief"] },
  { id: "st_rc_3", emoji: "🔥", name: "Fire reaction", category: "Reaction", tags: ["hot", "lit", "hype"] },
  { id: "st_rc_4", emoji: "💀", name: "Skull Dead", category: "Reaction", tags: ["dead", "laughing", "skull"] }
];

export const OTHER_STICKER_PACKS: StickerPack[] = [
  {
    id: "pack_cyber",
    name: "Cyber Neon Glow",
    icon: "⚡",
    author: "Breezy Team",
    isDownloaded: false,
    size: "420 KB",
    stickers: [
      { id: "st_cy_1", emoji: "🤖", name: "Cyber Bot", category: "Gaming", tags: ["bot", "robot", "cyberpunk"] },
      { id: "st_cy_2", emoji: "🌌", name: "Retro Wave", category: "Travel", tags: ["neon", "space", "retro"] },
      { id: "st_cy_3", emoji: "🛸", name: "UFO Beam", category: "Funny", tags: ["alien", "space", "beam"] },
      { id: "st_cy_4", emoji: "💾", name: "Floppy Disk", category: "Gaming", tags: ["retro", "save", "data"] }
    ]
  },
  {
    id: "pack_chibi",
    name: "Cute Chibi Animals",
    icon: "🐾",
    author: "Sakura Art",
    isDownloaded: false,
    size: "280 KB",
    stickers: [
      { id: "st_cb_a1", emoji: "🐹", name: "Cute Hamster", category: "Animals", tags: ["hamster", "chibi", "cute"] },
      { id: "st_cb_a2", emoji: "🐨", name: "Cozy Koala", category: "Animals", tags: ["koala", "sleepy", "chibi"] },
      { id: "st_cb_a3", emoji: "🐯", name: "Baby Tiger", category: "Animals", tags: ["tiger", "wild", "cute"] },
      { id: "st_cb_a4", emoji: "🦁", name: "Cute Cub", category: "Animals", tags: ["lion", "chibi"] }
    ]
  },
  {
    id: "pack_foodie",
    name: "Midnight Cravings",
    icon: "🌮",
    author: "Chef Luigi",
    isDownloaded: false,
    size: "510 KB",
    stickers: [
      { id: "st_fi_1", emoji: "🌮", name: "Taco Supreme", category: "Food", tags: ["taco", "mexican", "crunchy"] },
      { id: "st_fi_2", emoji: "🍣", name: "Sushi Roll", category: "Food", tags: ["sushi", "fish", "roll"] },
      { id: "st_fi_3", emoji: "🍕", name: "Mega Pizza", category: "Food", tags: ["pizza", "hot"] },
      { id: "st_fi_4", emoji: "🍦", name: "Soft Serve", category: "Food", tags: ["icecream", "sweet"] }
    ]
  }
];
