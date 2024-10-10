import React, {useEffect, useState} from 'react';
import Lottie from 'react-lottie';
import axios from 'axios';

const CourseLoader = () => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        const fetchAnimationData = async () => {
            try {
                const response = await axios.get('https://lottie.host/embed/75b88ffc-4507-4cbc-ac53-3bf126cc0984/NYqSb7z7qJ.json');
                setAnimationData(response.data);
            } catch (error) {
                console.error('Error fetching Lottie animation data:', error);
            }
        };

        fetchAnimationData();
    }, []);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return animationData ?? (
        <Lottie options={defaultOptions} height={400} width={400}/>
    )
};

export default CourseLoader;
