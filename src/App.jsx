import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout.jsx';
import { Home } from './pages/Home.jsx';
import { Lessons } from './pages/Lessons.jsx';
import { LessonDetail } from './pages/LessonDetail.jsx';
import { Practice } from './pages/Practice.jsx';
import { Progress } from './pages/Progress.jsx';
import { About } from './pages/About.jsx';
import { NotFound } from './pages/NotFound.jsx';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="lessons/:lessonId" element={<LessonDetail />} />
        <Route path="practice" element={<Practice />} />
        <Route path="progress" element={<Progress />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
