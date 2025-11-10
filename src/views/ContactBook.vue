<template>
  <div class="page row">
    <!-- Ô tìm kiếm -->
    <div class="col-md-10">
      <InputSearch v-model="searchText" />
    </div>

    <!-- Danh bạ -->
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>

      <ContactList
        v-if="filteredContactsCount > 0"
        :contacts="filteredContacts"
        v-model:activeIndex="activeIndex"
      />
      <p v-else>Không có liên hệ nào.</p>

      <div class="mt-3 row justify-content-around align-items-center">
        <button class="btn btn-sm btn-primary" @click="refreshList">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        <button class="btn btn-sm btn-success" @click="goToAddContact">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
        <button class="btn btn-sm btn-danger" @click="removeAllContacts">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>

    <!-- Chi tiết liên hệ -->
    <div class="mt-3 col-md-6">
      <div v-if="activeContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="activeContact" />
      </div>
    </div>
  </div>
</template>

<script>
import ContactCard from "@/components/ContactCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import ContactList from "@/components/ContactList.vue";
import ContactService from "@/services/contact.service";

export default {
  components: {
    ContactCard,
    InputSearch,
    ContactList,
  },
  data() {
    return {
      contacts: [], // Danh sách liên hệ
      activeIndex: -1, // Vị trí liên hệ đang chọn
      searchText: "", // Từ khóa tìm kiếm
    };
  },
  watch: {
    // Khi từ khóa tìm kiếm thay đổi, bỏ chọn liên hệ hiện tại
    searchText() {
      this.activeIndex = -1;
    },
  },
  computed: {
    // Tạo mảng các chuỗi chứa thông tin liên hệ (phục vụ tìm kiếm)
    contactStrings() {
      return this.contacts.map((contact) => {
        const { name, email, address, phone } = contact;
        return [name, email, address, phone].join("");
      });
    },
    // Lọc danh sách liên hệ theo từ khóa tìm kiếm
    filteredContacts() {
      if (!this.searchText) return this.contacts;
      return this.contacts.filter((_contact, index) =>
        this.contactStrings[index]
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    },
    // Liên hệ đang được chọn (dựa vào chỉ mục)
    activeContact() {
      if (this.activeIndex < 0) return null;
      return this.filteredContacts[this.activeIndex];
    },
    // Số lượng liên hệ sau khi lọc
    filteredContactsCount() {
      return this.filteredContacts.length;
    },
  },
  methods: {
    // Lấy danh sách liên hệ từ server
    async retrieveContacts() {
      try {
        this.contacts = await ContactService.getAll();
      } catch (error) {
        console.error("Lỗi tải danh bạ:", error);
      }
    },
    // Làm mới danh sách
    refreshList() {
      this.retrieveContacts();
      this.activeIndex = -1;
    },
    // Xóa tất cả liên hệ
    async removeAllContacts() {
      if (confirm("Bạn muốn xóa tất cả Liên hệ?")) {
        try {
          await ContactService.deleteAll();
          this.refreshList();
        } catch (error) {
          console.error("Lỗi xóa tất cả:", error);
        }
      }
    },
    // Chuyển sang trang thêm mới liên hệ
    goToAddContact() {
      this.$router.push({ name: "contact.add" });
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>
