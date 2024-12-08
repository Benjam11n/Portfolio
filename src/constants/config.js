export const config = {
  title: "Benjamin's portfolio",
  sections: ['home', 'about', 'experience', 'projects', 'contact'],
  home: {
    title: 'BENJAMIN',
    subtitle: 'WANG',
  },
  skills: [
    { name: 'React', icon: 'icons/react-native.png', level: 80 },
    { name: 'JavaScript', icon: 'icons/javascript.png', level: 80 },
    { name: 'Three.js', icon: 'icons/threejs.png', level: 80 },
    { name: 'Blender', icon: 'icons/blender-3d.png', level: 50 },
    { name: 'English', icon: 'icons/usa.png', level: 90 },
  ],
  projects: [
    {
      name: 'Dissolve tutorial',
      description: 'Create a dissolve effect with React Three Fiber',
      image: 'projects/project1.jpg',
      link: 'example.com',
    },
    {
      name: 'Dissolve tutorial 2',
      description: 'Create a dissolve effect with React Three Fiber',
      image: 'projects/project1.jpg',
      link: 'example.com',
    },
    {
      name: 'Dissolve tutorial 3',
      description: 'Create a dissolve effect with React Three Fiber',
      image: 'projects/project1.jpg',
      link: 'example.com',
    },
    {
      name: 'Dissolve tutorial 4',
      description: 'Create a dissolve effect with React Three Fiber',
      image: 'projects/project1.jpg',
      link: 'example.com',
    },
  ],
  contact: {
    name: 'Benjamin Wang',
    address: 'Singapore, Singapore',
    socials: {
      linkedin: 'https://www.example.com',
      github: 'https://www.example.com',
    },
    mail: 'test@test.com',
  },
};
