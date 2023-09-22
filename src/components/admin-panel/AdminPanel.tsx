import { useAppSelector } from '@/redux/hooks';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  VStack, Select
} from '@chakra-ui/react';
import { adminPanelStyles } from './AdminPanelStyles';
import React, { useEffect, useState } from 'react';
import { getAllUsers, removeUser, updateUser } from '@util/api-calls.ts';
import { TUser } from '@/types/user.ts';
import { Flex } from '@chakra-ui/layout';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const isAdminPanelOpen = useAppSelector(
    (state) => state.adminPanel.isAdminPanelOpen
  );
  const data = useSelector((state: RootState) => ({
    categories: state.categories,
    products: state.products
  }));
  const [userData, setUserData] = useState<TUser[]>();
  const navigate = useNavigate();

  const loadData = async () => {
    await getAllUsers().then((res) => setUserData(res.data)).catch((err) => {
      throw new Error(err);
    });
  };

  const updateData = async (userId: number, role: string) => {
    await updateUser(userId, role).then((res) => {
      console.log(res.data);
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 500);
      toast.success('User updated successfully!');
    }).catch((err) => {
      throw new Error(err);
    });
  };

  const removeData = async (userId: number) => {
    await removeUser(userId).then((res) => {
      console.log(res.data);
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 500);
      toast.success('User updated successfully!');
    }).catch((err) => {
      throw new Error(err);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLOptionElement>, userId: number | undefined) => {
    if (userId) {
      updateData(userId, e.target.value);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!isAdminPanelOpen) return null;

  return (
    <div>
      <Box color='white'>
        <Link to={''}>Create New Category</Link>
      </Box>

      <Box color='white'>
        <Link to={''}>Edit categories</Link>
      </Box>

      <ul>
        {data.categories.map((category) => (
          <Accordion defaultIndex={[0]} allowMultiple key={category.id}>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box
                    style={adminPanelStyles}
                    as='span'
                    flex='1'
                    textAlign='left'
                  >
                    {category.categoryName}
                  </Box>
                  <AccordionIcon style={adminPanelStyles} />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack color='white' align='stretch'>
                  {data.products
                    .filter(
                      (product) => product.category === category.categoryName
                    )
                    .map((product) => (
                      <Box key={product.id}>
                        <Link to={`${product.category}/${product.name}`}>
                          {product.name}
                        </Link>
                      </Box>
                    ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ))}
      </ul>
      <h2 style={{margin: "5% 5% 0 5%", color: "#64FFDA"}}>Users</h2>
      {userData?.map((user) => (
        <Flex key={user.id} marginY='5px' paddingX='5%' paddingY="5px" justifyContent='space-between' alignItems="center" >
          <Box color={'white'}>
            <h2 color={'white'}>{user.username}</h2>
          </Box>
          <Box>
            <Select placeholder='Select role' color={'white'} onChange={(e) => handleChange(e, user.id)}>
              {user.role === 'admin' ? (
                <>
                  <option value='admin' disabled>admin</option>
                  <option value='regular'>regular</option>
                </>
              ) : (
                <>
                  <option value='admin'>admin</option>
                  <option value='regular' disabled>regular</option>
                </>
              )}
            </Select>
          </Box>
        </Flex>
      ))}
    </div>
  );
};

export default AdminPanel;