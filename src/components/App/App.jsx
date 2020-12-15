import { useState } from 'react';

import Searchbar from '../../components/Searchbar';
import ImageGallery from '../../components/ImageGallery';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

import './App.css';

import FetchService from '../../services/fetch-services';
const fetchService = new FetchService();
const shortid = require('shortid');

function App() {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImg, setCurrentImg] = useState({ src: '', alt: '' });
  const [totalImgs, setTotalImgs] = useState(0);

  const handlerSubmit = search => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    fetchService.searchQuery = search;
    fetchService.pageNumber = 1;
    fetchService.currentCount = 0;
    fetchService
      .fetchData()
      .then(data => {
        const images = data.hits.map(el => ({
          ...el,
          key_id: shortid.generate(),
        }));
        setImages([...images]);
        setTotalImgs(data.totalHits);
      })
      .catch(console.log)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLoadMore = () => {
    const HeightBeforeRender = document.documentElement.scrollHeight;
    setIsLoading(true);
    fetchService
      .nextDataPortion()
      .then(data => {
        setImages(prevState => {
          const images = data.hits.map(el => ({
            ...el,
            key_id: shortid.generate(),
          }));
          return [...prevState, ...images];
        });
      })
      .catch(console.log)
      .then(() => {
        handlerScrollTo(HeightBeforeRender);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handlerItemClick = id => {
    toggleModal();
    const current = images.find(el => el.id === id);
    setCurrentImg({ src: current.largeImageURL, alt: current.tags });
  };
  const handlerScrollTo = height => {
    const searchElementHeight = 70;
    const buttonLoadmoreHeight = 80;
    const renderedContentHeight =
      document.documentElement.scrollHeight - height;
    const scrollTo =
      document.documentElement.scrollHeight - renderedContentHeight;
    window.scrollTo({
      top: scrollTo - (searchElementHeight + buttonLoadmoreHeight),
      behavior: 'smooth',
    });
  };
  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };
  const isButtonVisible =
    images.length > 0 && fetchService.currentCount < totalImgs && !isLoading;
  return (
    <div className="App">
      <Searchbar onSubmit={handlerSubmit} />
      <ImageGallery list={images} handlerItemClick={handlerItemClick} />

      {isButtonVisible ? (
        <Button isOff={false} onClick={handleLoadMore} />
      ) : (
        isLoading && <Button isOff={true} onClick={handleLoadMore} />
      )}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={currentImg.src} alt={currentImg.alt} />
        </Modal>
      )}
    </div>
  );
}
export default App;
