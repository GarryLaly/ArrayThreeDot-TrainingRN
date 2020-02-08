import React, {Component} from 'react';
import styled from 'styled-components';
import {Modal, TextInput} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

const Container = styled.View`
  background-color: #eee;
  flex: 1;
  padding: 30px;
`;

const Item = styled.View`
  background-color: ${({isActive}) => (isActive ? 'green' : 'white')};
  margin-bottom: 10px;
  padding: 15px 20px;
`;

const Title = styled.Text`
  font-size: 16px;
  color: #333;
`;

const Action = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const ActionText = styled.Text`
  background: #efefef;
  font-size: 12px;
  padding: 15px 20px;
  color: #333;
  margin-right: 10px;
`;

const Button = styled.TouchableOpacity`
  background: #555;
  padding: 20px;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: white;
`;

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      items: [
        {
          firstName: 'Budi',
          lastName: 'Santoso',
          isSelected: false,
        },
      ],
      modeEdit: false,
      editIndex: null,
    };
  }

  addToArray(values) {
    let array = this.state.items;
    array.push(values);

    this.setState({items: array, modalVisible: false});
  }

  editToArray(values) {
    const array = this.state.items.map((item, index) => {
      if (index === this.state.editIndex) {
        return values;
      }

      return item;
    });

    this.setState({items: array, modalVisible: false});
  }

  selectArray(selectedIndex) {
    const array = this.state.items.map((item, index) => {
      if (index === selectedIndex) {
        return {
          ...item,
          isSelected: !item.isSelected,
        };
      }

      return item;
    });

    this.setState({items: array});
  }

  removeArray(index) {
    console.warn(index);
    const array = this.state.items;
    array.splice(index, 1);

    this.setState({items: array});
  }

  validate(values) {
    const errors = {};

    if (values.firstName === '') {
      errors.firstName = 'First name is required';
    }
    if (values.lastName === '') {
      errors.lastName = 'Last name is required';
    }

    return errors;
  }

  render() {
    const FormSchema = Yup.object().shape({
      firstName: Yup.string().required('* First name is required with Yup'),
      lastName: Yup.string().required('* Last name is required with Yup'),
    });

    return (
      <>
        <Container>
          {this.state.items.length === 0 && <Title>Data tidak ada.</Title>}
          {this.state.items.map((item, index) => (
            <Item key={index} isActive={item.isSelected}>
              <Title>{item.firstName + ' ' + item.lastName}</Title>
              <Action>
                <ActionText
                  onPress={() =>
                    this.setState({
                      modalVisible: true,
                      modeEdit: true,
                      editIndex: index,
                    })
                  }>
                  Ubah
                </ActionText>
                <ActionText onPress={() => this.removeArray(index)}>
                  Hapus
                </ActionText>
                <ActionText onPress={() => this.selectArray(index)}>
                  Pilih
                </ActionText>
              </Action>
            </Item>
          ))}
        </Container>
        <Button onPress={() => this.setState({modalVisible: true})}>
          <ButtonText>Tambah Item</ButtonText>
        </Button>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <Formik
            initialValues={{
              firstName: this.state.modeEdit
                ? this.state.items[this.state.editIndex].firstName
                : '',
              lastName: this.state.modeEdit
                ? this.state.items[this.state.editIndex].lastName
                : '',
            }}
            // validate={this.validate}
            validationSchema={FormSchema}
            onSubmit={values =>
              this.state.modeEdit
                ? this.editToArray(values)
                : this.addToArray(values)
            }>
            {({handleChange, handleSubmit, values, errors, touched}) => (
              <>
                <TextInput
                  onChangeText={handleChange('firstName')}
                  value={values.firstName}
                  label="First name"
                  placeholder="Type your first name"
                />
                {errors.firstName && touched.firstName && (
                  <Title>{errors.firstName}</Title>
                )}
                <TextInput
                  onChangeText={handleChange('lastName')}
                  value={values.lastName}
                  label="Last name"
                  placeholder="Type your last name"
                />
                {errors.lastName && touched.lastName && (
                  <Title>{errors.lastName}</Title>
                )}
                <Button onPress={() => handleSubmit()}>
                  <ButtonText>Simpan</ButtonText>
                </Button>
              </>
            )}
          </Formik>
        </Modal>
      </>
    );
  }
}

export default List;
