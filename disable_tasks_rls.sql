ALTER TABLE WardBoyTasks DISABLE ROW LEVEL SECURITY;

-- If you prefer keeping it enabled, we can explicitly allow everything for anon/authenticated 
-- CREATE POLICY "allow_all_select" ON WardBoyTasks FOR SELECT USING (true);
-- CREATE POLICY "allow_all_insert" ON WardBoyTasks FOR INSERT WITH CHECK (true);
-- CREATE POLICY "allow_all_update" ON WardBoyTasks FOR UPDATE USING (true);
-- CREATE POLICY "allow_all_delete" ON WardBoyTasks FOR DELETE USING (true);
