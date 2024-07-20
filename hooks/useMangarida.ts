import axios from "axios";

const useMangarida = () => {
  const getChapterPages = async (slug: string, chNum: string) => {
    // console.log(slug + chNum);
    const url = `http://192.168.1.73:5000/read/${slug}/chapter-${chNum}`;

    try {
      const { data } = await axios.get(url);
      if (data) {
        return data.pages;
      } else {
        throw Error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { getChapterPages };
};

export default useMangarida;
