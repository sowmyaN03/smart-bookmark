import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

export const useBookmarks = (session) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', session.user.id);
      if (error) console.error(error);
      else setItems(data);
      setLoading(false);
    };
    load();
  }, [session]);

  return { items, loading };
};