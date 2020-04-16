<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
      <span class="expand-key">角色: </span>
      <span class="expand-value">{{ row.roleName }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">电话:</span>
      <span class="expand-value">{{ row.phone }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">邮箱: </span>
      <span class="expand-value">{{ row.email }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
      <span class="expand-key">生日: </span>
      <span class="expand-value">{{ row.birthday | YMDFilter}}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">创建日期: </span>
      <span class="expand-value">{{ row.createtime }}</span>
      </Col>

    </Row>
  </div>
</template>
<script>
  export default {
    props: {
      row: Object
    }
  };
</script>
