import { getMyReviews } from '../Axios';

export async function loadData(setData, setLoading, approvedSetting) {
  async function loadReviews() {
    await getMyReviews().then(({ data }) => {
      const isNew = data.filter((item) => item.isApproved === approvedSetting);
      setData(isNew);
      setLoading(false);
    });
  }
  await loadReviews();
}
